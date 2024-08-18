import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong_game.settings')
django.setup()

import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random
from users.models import Profile
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from datetime import datetime
import time
import uuid
from django.core.cache import cache


User = get_user_model() # get the user data model from the Django auth module

class PongConsumer(AsyncWebsocketConsumer):
	game_sessions = {}
	disconnected_players = {}
	rejoin_timeout = 10  # should be changed to a better amount
	sessionId = None

	
	
	# 												***	websocket connection handling ***

	# for every new connection, method checks if the user was previously connected or not
	# if yes, then it checks if the user is still within the rejoin timeout period
	# if yes, then it adds the user to the same game session
	# if no, then it creates a new game session


	async def connect(self):
		await self.accept()
		user = self.scope['user']
		session_id = self.scope['url_route']['kwargs'].get('session_id')
		self.sessionId = session_id
		if session_id not in self.game_sessions:
			print("Creating new game session...")
			self.game_sessions[session_id] = {
				'players': {},
				'game_state': {
					'ball': {'x': 450, 'y': 290, 'dx': 5, 'dy': 5},
					'paddle1': 260,
					'paddle2': 260,
					'score': {'player1': 0, 'player2': 0}
				},
				'game_loop_task': None
			}
		if user.is_authenticated:
			if session_id in self.game_sessions and len(self.game_sessions[session_id]['players']) < 2:  # handle new user connection
				self.session_id = session_id
				self.add_player_to_session(session_id, user.username, self.channel_name)
				await self.channel_layer.group_add(session_id, self.channel_name)
				await self.channel_layer.group_send(
					session_id,
					{
						'type': 'player_joined',
						'name': user.username
					}
				)
				if len(self.game_sessions[session_id]['players']) == 2:
					self.countdown_task = asyncio.create_task(self.start_game_countdown(session_id))
			else:
				print("Not a tournament game session.")
				await self.close(code=3002)
		else:
			print("User is not authenticated. Closing connection...")
			await self.close(3003)

	async def disconnect(self, close_code):
		if hasattr(self, 'session_id') and self.session_id in self.game_sessions:
			player_name = self.game_sessions[self.session_id]['players'].pop(self.channel_name, None)
			other_player = next(iter(self.game_sessions[self.session_id]['players'].values()), None)
			if player_name:
				print(f"Player {player_name} disconnected from session {self.session_id}")
				if 'game_loop_task' in self.game_sessions[self.session_id]:
					if self.game_sessions[self.session_id]['game_loop_task']:
						self.game_sessions[self.session_id]['game_loop_task'].cancel()
						self.game_sessions[self.session_id]['game_loop_task'] = None
			if other_player:
				print('winner ###:', other_player)
				await self.channel_layer.group_send(
					self.session_id,
					{
						'type': 'game_over',
						'winner': other_player,
						'looser': player_name
					}
				)
				await self.close_game_session(self.session_id, other_player, player_name)
				#asyncio.create_task(self.check_player_rejoin_timeout(self.session_id, player_name, other_player))	
					


	# 												***	message handling ***

	# method receives messages from the client and processes them, in this case, it moves the paddle up or down
	# based on the key pressed by the player. The method then sends the updated game state to the clients


	async def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'paddle_move':
			await self.move_paddle(data['key'])

	async def move_paddle(self, key):
		user = self.scope['user']
		if user.username == list(self.game_sessions[self.session_id]['players'].values())[1]:
			paddle = 'paddle1'
		else:
			paddle = 'paddle2'
		if key == 'ArrowUp' and self.game_sessions[self.session_id]['game_state'][paddle] > 0:
			self.game_sessions[self.session_id]['game_state'][paddle] -= 10
		elif key == 'ArrowDown' and self.game_sessions[self.session_id]['game_state'][paddle] < 500:
			self.game_sessions[self.session_id]['game_state'][paddle] += 10


	# 												***	game session handling ***
	
	def add_player_to_session(self, session_id, username, channel_name):
		self.game_sessions[session_id]['players'][channel_name] = username

	def resume_game(self, session_id):
		if 'game_loop_task' not in self.game_sessions[session_id] or self.game_sessions[session_id]['game_loop_task'] is None:
			self.game_sessions[session_id]['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))

	# check if the player has reconnected within the timeout period and it's name is deleted from disconnected players, and if not, declare the remaining player as the winner
	# and close the game session

	async def check_player_rejoin_timeout(self, session_id, disconnected_player, other_player):
		if len(self.game_sessions[session_id]['players']) == 1:
			await self.channel_layer.group_send(
				self.session_id,
				{
					'type': 'game_stop',
					'message': 'wait for the opponent to rejoin...'
				}
			)
		await asyncio.sleep(self.rejoin_timeout)
		if disconnected_player in self.disconnected_players and self.disconnected_players[disconnected_player]['session_id'] == session_id:
			del self.disconnected_players[disconnected_player]
			if other_player:
				await self.channel_layer.group_send(
					session_id,
					{
						'type': 'game_over',
						'winner': other_player
					}
				)
				print(f"Player {disconnected_player} did not rejoin in time. {other_player} wins by default.")
				await self.close_game_session(session_id, other_player)

	# 															***	game play ***

	# method sends messages to the clients to start the game countdown. It then sends messages to the clients to update the game state
	# the game loop method updates the game state and sends the updated game state to the clients. the game loop runs until the game is over
	# the update game state method updates the position of the ball, checks for collisions, updates the score, and checks for a winner


	async def start_game_countdown(self, session_id):
		user = self.scope['user']
		player_list = list(self.game_sessions[session_id]['players'].values())
		print(f"Players in session {session_id}: {player_list}")
		if user.username == player_list[0]:
			opponent = player_list[1]
		else:
			opponent = player_list[0]
		print(f"opponent: {opponent}")
		await self.channel_layer.group_send(
			session_id,
			{
				'type': 'both_players_joined',
				'name': opponent
			}
		)
		await asyncio.sleep(2)
		for i in range(3, 0, -1):
			await self.channel_layer.group_send(
				session_id,
				{
					'type': 'countdown',
					'message': f"Game starts in {i} seconds..."
				}
			)
			await asyncio.sleep(1)
		await self.channel_layer.group_send(
			session_id,
			{
				'type': 'game_started'
			}
		)
		self.game_sessions[session_id]['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))
	
	async def game_loop(self, session_id):
		while len(self.game_sessions[session_id]['players']) == 2:
			self.update_game_state(session_id)
			await self.channel_layer.group_send(
				session_id,
				{
					'type': 'game_state_update',
					'game_state': self.game_sessions[session_id]['game_state']
				}
			)
			await asyncio.sleep(0.033)

	def update_game_state(self, session_id):
		game_state = self.game_sessions[session_id]['game_state']

		game_state['ball']['x'] += game_state['ball']['dx']
		game_state['ball']['y'] += game_state['ball']['dy']

		if game_state['ball']['y'] <= 15 or game_state['ball']['y'] >= 585:
			game_state['ball']['dy'] *= -1

		if (game_state['ball']['x'] <= 30 and game_state['paddle1'] <= game_state['ball']['y'] <= game_state['paddle1'] + 100):
			game_state['ball']['dx'] *= -1
		elif (game_state['ball']['x'] >= 865 and game_state['paddle2'] <= game_state['ball']['y'] <= game_state['paddle2'] + 100):
			game_state['ball']['dx'] *= -1

		if game_state['ball']['x'] <= 10:
			game_state['score']['player2'] += 1
			self.reset_ball(session_id)
		elif game_state['ball']['x'] >= 890:
			game_state['score']['player1'] += 1
			self.reset_ball(session_id)

		if game_state['score']['player1'] >= 2 or game_state['score']['player2'] >=2: # how many goals needed to win a game. change in this line and next line
			winner = list(self.game_sessions[session_id]['players'].values())[1] if game_state['score']['player1'] >= 2 else list(self.game_sessions[session_id]['players'].values())[0]
			result = {
				'players': list(self.game_sessions[session_id]['players'].values()),
				'winner': winner,
				'score': game_state['score']
			}
			asyncio.create_task(self.send_game_result(result, session_id, winner))
			self.reset_game(session_id)

	def reset_ball(self, session_id):
		game_state = self.game_sessions[session_id]['game_state']
		game_state['ball']['x'] = 450
		game_state['ball']['y'] = 290
		game_state['ball']['dx'] = random.choice([-5, 5])
		game_state['ball']['dy'] = random.choice([-5, 5])
		
	def reset_game(self, session_id):
		self.game_sessions[session_id]['game_state'] = {
			'ball': {'x': 450, 'y': 290, 'dx': 5, 'dy': 5},
			'paddle1': 260,
			'paddle2': 260,
			'score': {'player1': 0, 'player2': 0}
		}
		self.game_sessions[session_id]['players'] = {}
		if self.game_sessions[session_id]['game_loop_task']:
			self.game_sessions[session_id]['game_loop_task'].cancel()
			self.game_sessions[session_id]['game_loop_task'] = None
			

	# 															***	message handling ***

	# receive data from channels and send messages to the clients. the messages are sent to the channel layer, which then sends them to the clients
	# each message type has a corresponding method that sends the message to the clients, and the client will handle the message accordingly


	async def game_state_update(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_state',
			'game_state': event['game_state']
		}))
		
	async def player_joined(self, event):
		await self.send(text_data=json.dumps({
			'type': 'player_joined',
			'name': event['name']
		}))

	async def player_rejoined(self, event):
		await self.send(text_data=json.dumps({
			'type': 'player_rejoined',
			'name': event['name'],
			'opponent': event['opponent']
		}))
		
	async def both_players_joined(self, event):
		await self.send(text_data=json.dumps({
			'type': 'both_players_joined',
			'message': 'Both players joined. Get ready!',
			'name': event['name']
		}))
		
	async def countdown(self, event):
		await self.send(text_data=json.dumps({
			'type': 'countdown',
			'message': event['message']
		}))
		
	async def game_over(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_over',
			'winner': event['winner'],
			'looser': event['looser']
		}))
		await asyncio.sleep(2)
		await self.close()
		
	async def game_started(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_started',
			'message': 'Game started!'
		}))

	async def game_stop(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_stop',
			'message': event['message']
		}))

	async def close_game_session(self, session_id, winner, looser):
		# Method to close a game session and handle winner declaration
		game_session = self.game_sessions.pop(session_id, None)
		if game_session:
			for player_channel in game_session['players'].keys():
				await self.channel_layer.group_discard(session_id, player_channel)
			result = {
				'players': list(game_session['players'].values()),
				'winner': winner,
				'looser': looser,
				'score': game_session['game_state']['score']
			}
			await self.send_game_result(result, session_id, winner, looser)
			print(f"Game session {session_id} closed. Winner: {winner}")

			# Update tournament cache with the game result
			#await self.update_tournament_cache(result)

	async def send_game_result(self, result, session_id, winner, looser):
		await self.update_tournament_cache(result)
		asyncio.create_task(self.channel_layer.group_send(
			session_id,
			{
				'type': 'game_over',
				'winner': winner,
				'loooser': looser
			}
		))
		
	async def update_tournament_cache(self, result):
		try:
			tournament = cache.get('tournament')
			loosers = cache.get('loosers', [])
			for match in tournament['semi_finals']:
				if match['session_id'] == self.sessionId:
					match['winner'] = result['winner']
					loosers.append(result['looser'])
					cache.set('tournament', tournament, timeout=3600)
					cache.set('loosers', loosers, timeout=3600)
					break
			if tournament['final']['session_id'] and tournament['final']['session_id'] == self.sessionId:
				tournament['final']['winner'] = result['winner']		
				cache.set('tournament', tournament, timeout=3600)
			print('Tournament updated:', tournament)
			#await asyncio.sleep(1)
		except Exception as e:
			print('Error updating tournament cache:', e)
			pass

	

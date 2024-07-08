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


#https://channels.readthedocs.io/en/stable/topics/consumers.html
#https://docs.djangoproject.com/en/3.2/topics/auth/default/#user-objects

# get the user data model from the Django auth module
User = get_user_model()

class PongConsumer(AsyncWebsocketConsumer):
	game_sessions = {}
	disconnected_players = {}

	# websocket connection handling
	async def connect(self):
		await self.accept()
		user = self.scope['user']
		if user.is_authenticated:
			if user.username in self.disconnected_players:
				session_id = self.disconnected_players[user.username]['session_id']
				if time.time() < self.disconnected_players[user.username]['rejoin_deadline']:
					self.session_id = session_id
					self.add_player_to_session(session_id, user.username, self.channel_name)
					await self.channel_layer.group_add(session_id, self.channel_name)
					await self.channel_layer.group_send(
						session_id,
						{
							'type': 'player_rejoined',
							'name': user.username
						}
					)
					del self.disconnected_players[user.username]
					print(f"Player {user.username} rejoined session {session_id}")
					# Resume game loop if both players are back
					if len(self.game_sessions[session_id]['players']) == 2:
						self.resume_game(session_id)
					return
				else:
					del self.disconnected_players[user.username]
					print(f"Rejoin deadline expired for player {user.username}")
					return

			session_id = self.get_available_session()
			if session_id:
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
				await self.close()
				print("Connection closed: no available game session")
		else:
			await self.close()
			print("Connection closed for unauthenticated user")

	# channels.exceptions.AcceptConnection or channels.exceptions.DenyConnection
	async def disconnect(self, close_code):
		if hasattr(self, 'session_id') and self.session_id in self.game_sessions:
			player_name = self.game_sessions[self.session_id]['players'].pop(self.channel_name, None)
			other_player = next(iter(self.game_sessions[self.session_id]['players'].values()), None)
			if player_name:
				self.disconnected_players[player_name] = {
					'session_id': self.session_id,
					'rejoin_deadline': time.time() + 10 # change it
				}
				if len(self.game_sessions[self.session_id]['players']) == 1:
					await self.joinTimeoutCheck(self.session_id, other_player, player_name)
				await self.channel_layer.group_discard(self.session_id, self.channel_name)
				print(f"Player {player_name} disconnected from session {self.session_id}")
				if 'game_loop_task' in self.game_sessions[self.session_id] and self.game_sessions[self.session_id]['game_loop_task'] is not None:
					self.game_sessions[self.session_id]['game_loop_task'].cancel()
					self.game_sessions[self.session_id]['game_loop_task'] = None
					


	# message handling
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
		elif key == 'ArrowDown' and self.game_sessions[self.session_id]['game_state'][paddle] < 300:
			self.game_sessions[self.session_id]['game_state'][paddle] += 10
	
	# session management
	def get_available_session(self):
		for session_id, session in self.game_sessions.items():
			if len(session['players']) < 2:
				return session_id
		new_session_id = f"game_session_{len(self.game_sessions) + 1}"
		self.game_sessions[new_session_id] = {
			'players': {},
			'game_state': {
				'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
				'paddle1': 160,
				'paddle2': 160,
				'score': {'player1': 0, 'player2': 0}
			},
			'game_loop_task': None
		}
		return new_session_id
	
	def add_player_to_session(self, session_id, username):
		self.game_sessions[session_id]['players'][self.channel_name] = username
		#self.game_sessions[session_id]['players'] = username

	# game play
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

		if game_state['ball']['y'] <= 0 or game_state['ball']['y'] >= 380:
			game_state['ball']['dy'] *= -1

		if (game_state['ball']['x'] <= 20 and game_state['paddle1'] <= game_state['ball']['y'] <= game_state['paddle1'] + 80):
			game_state['ball']['dx'] *= -1
		elif (game_state['ball']['x'] >= 760 and game_state['paddle2'] <= game_state['ball']['y'] <= game_state['paddle2'] + 80):
			game_state['ball']['dx'] *= -1

		if game_state['ball']['x'] <= 0:
			game_state['score']['player2'] += 1
			self.reset_ball(session_id)
		elif game_state['ball']['x'] >= 780:
			game_state['score']['player1'] += 1
			self.reset_ball(session_id)

		if game_state['score']['player1'] >= 2 or game_state['score']['player2'] >=2:
			winner = list(self.game_sessions[session_id]['players'].values())[1] if game_state['score']['player1'] >= 3 else list(self.game_sessions[session_id]['players'].values())[0]
			result = {
				'players': list(self.game_sessions[session_id]['players'].values()),
				'winner': winner,
				'score': game_state['score']
			}
			# asyncio.create_task(self.channel_layer.group_send(
			# 	session_id,
			# 	{
			# 		'type': 'game_over',
			# 		'winner': winner
			# 	}
			# ))
			asyncio.create_task(self.send_game_result(result, session_id, winner))
			self.reset_game(session_id)
			

	def reset_ball(self, session_id):
		game_state = self.game_sessions[session_id]['game_state']
		game_state['ball']['x'] = 390
		game_state['ball']['y'] = 190
		game_state['ball']['dx'] = random.choice([-5, 5])
		game_state['ball']['dy'] = random.choice([-5, 5])
		
	def reset_game(self, session_id):
		self.game_sessions[session_id]['game_state'] = {
			'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
			'paddle1': 160,
			'paddle2': 160,
			'score': {'player1': 0, 'player2': 0}
		}
		self.game_sessions[session_id]['players'] = {}
		if self.game_sessions[session_id]['game_loop_task']:
			self.game_sessions[session_id]['game_loop_task'].cancel()
			self.game_sessions[session_id]['game_loop_task'] = None
			

	# receive data from channels and send messages to the clients
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
			'name': event['name']
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
			'winner': event['winner']
		}))
		await asyncio.sleep(2)
		await self.close()
		
	async def game_started(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_started',
			'message': 'Game started!'
		}))

	async def send_game_result(self, result, session_id, winner):
		user = self.scope['user']
		opponent_username = result['players'][1] if user.username == result['players'][0] else result['players'][0]
		opponent_user = await self.get_user_by_username(opponent_username)

		current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

		if result['winner'] == user.username:
			winner = user.username
			looser = opponent_username
		else:
			winner = opponent_username
			looser = user.username
		
		historyString = f"{current_time}, {winner}, {looser};"

		if result['winner'] == user.username:
			await self.update_profile(user, 'wins', historyString)
			await self.update_profile(opponent_user, 'losses', historyString)
		else:
			await self.update_profile(user, 'losses', historyString)
			await self.update_profile(opponent_user, 'wins', historyString)
		
		asyncio.create_task(self.channel_layer.group_send(
			session_id,
			{
				'type': 'game_over',
				'winner': winner
			}
		))
	
	@sync_to_async
	def get_user_by_username(self, username):
		return User.objects.get(username=username)

	@sync_to_async
	def get_user_profile(self, user):
		return Profile.objects.get(user=user)

	@sync_to_async
	def update_profile(self, user, result_type, historyString):
		profile = Profile.objects.get(user=user)
		if result_type == 'wins':
			profile.wins += 1
		elif result_type == 'losses':
			profile.losses += 1

		if profile.match_history is None:
			profile.match_history = ''
		profile.match_history += historyString
		profile.save()
		#print("player stats: ", user.username, Profile.objects.get(user=user).losses, Profile.objects.get(user=user).wins)

	def add_player_to_session(self, session_id, username, channel_name):
		self.game_sessions[session_id]['players'][channel_name] = username

	def resume_game(self, session_id):
		if 'game_loop_task' not in self.game_sessions[session_id] or self.game_sessions[session_id]['game_loop_task'] is None:
			self.game_sessions[session_id]['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))

	async def joinTimeoutCheck(self, session_id, winner, looser):
		await asyncio.sleep(3)
		if len(self.game_sessions[session_id]['players']) < 2:
			historyString = f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}, {winner}, {looser};"
			await self.update_profile(winner, 'wins', historyString)
			await self.update_profile(looser, 'losses', historyString)
			print("Connection closed: game session timed out")
			await self.close()
	
	


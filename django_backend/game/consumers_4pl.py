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

User = get_user_model()

# minor changes compared to the 2 player pong game. the changed are explained
# in the comments above the methods.

class PongConsumer(AsyncWebsocketConsumer):
	game_sessions = {}
	disconnected_players = {}
	rejoin_timeout = 10
	goals_to_win = 5
	paddle_speed = 10

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
							'name': user.username,
							'opponents': self.disconnected_players[user.username]['opponents']
						}
					)
					del self.disconnected_players[user.username]
					if len(self.game_sessions[session_id]['players']) == 4:
						self.resume_game(session_id)
					return
				else:
					del self.disconnected_players[user.username]
					return
				
			for session in self.game_sessions.values():
				if user.username in session['players'].values():
					print(f"Player {user.username} has already joined a game session.")
					await self.close(code = 3001)
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
				if len(self.game_sessions[session_id]['players']) == 4:
					self.countdown_task = asyncio.create_task(self.start_game_countdown(session_id))
			else:
				await self.close(code = 3002)
				print("Connection closed: no available game session")
		else:
			await self.close(code = 3003)
			print("Connection closed for unauthenticated user")

	async def disconnect(self, close_code):
		if hasattr(self, 'session_id') and self.session_id in self.game_sessions:
			player_name = self.game_sessions[self.session_id]['players'].pop(self.channel_name, None)
			other_players = list(self.game_sessions[self.session_id]['players'].values())
			if player_name:
				self.disconnected_players[player_name] = {
					'session_id': self.session_id,
					'rejoin_deadline': time.time() + self.rejoin_timeout,
					'opponents': other_players
				}
				await self.channel_layer.group_discard(self.session_id, self.channel_name)
				if 'game_loop_task' in self.game_sessions[self.session_id]:
					if self.game_sessions[self.session_id]['game_loop_task']:
						self.game_sessions[self.session_id]['game_loop_task'].cancel()
						self.game_sessions[self.session_id]['game_loop_task'] = None
				asyncio.create_task(self.check_player_rejoin_timeout(self.session_id, player_name, other_players))

	async def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'paddle_move':
			await self.move_paddle(data['key'])

	# paddle movement is similar to the 2player pong game, except that the 
	# paddles are now 4, and the movement is based on the user's position in 
	# the game and the key pressed

	async def move_paddle(self, key):
		user = self.scope['user']
		paddle = None
		players = list(self.game_sessions[self.session_id]['players'].values())

		if user.username == players[0]:
			paddle = 'paddle1'
		elif user.username == players[1]:
			paddle = 'paddle2'
		elif user.username == players[2]:
			paddle = 'paddle3'
		elif user.username == players[3]:
			paddle = 'paddle4'

		if paddle:
			game_state = self.game_sessions[self.session_id]['game_state']
			if paddle in ['paddle1', 'paddle3']:
				if key == 'ArrowUp' and game_state[paddle] > 0:
					game_state[paddle] -= self.paddle_speed
				elif key == 'ArrowDown' and game_state[paddle] < 500:
					game_state[paddle] += self.paddle_speed
			elif paddle in ['paddle2', 'paddle4']:
				if key == 'ArrowLeft' and game_state[paddle] > 0:
					game_state[paddle] -= self.paddle_speed

				elif key == 'ArrowRight' and game_state[paddle] < 500:
					game_state[paddle] += self.paddle_speed

	def get_available_session(self):
		for session_id, session in self.game_sessions.items():
			if len(session['players']) < 4:
				return session_id
		new_session_id = f"game_session_{uuid.uuid4()}"
		self.game_sessions[new_session_id] = {
			'players': {},
			'game_state': {
				'ball': {'x': 295, 'y': 295, 'dx': random.choice([-3, 3]), 'dy': random.choice([-5, 5])},
				'paddle1': 250,
				'paddle2': 250,
				'paddle3': 250,
				'paddle4': 250,
				'score': {'player1': 0, 'player2': 0, 'player3': 0, 'player4': 0},
				'last_touch': None,
				'out_of_bounds': False,
				'goal': False
			},
			'game_loop_task': None
		}
		return new_session_id

	def add_player_to_session(self, session_id, username, channel_name):
		self.game_sessions[session_id]['players'][channel_name] = username

	def resume_game(self, session_id):
		if 'game_loop_task' not in self.game_sessions[session_id] or self.game_sessions[session_id]['game_loop_task'] is None:
			self.game_sessions[session_id]['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))

	async def check_player_rejoin_timeout(self, session_id, disconnected_player, other_players):
		if len(self.game_sessions[session_id]['players']) == 3:
			await self.channel_layer.group_send(
				session_id,
				{
					'type': 'game_stop',
					'message': 'Waiting for the opponent to rejoin...'
				}
			)
		await asyncio.sleep(self.rejoin_timeout)
		if disconnected_player in self.disconnected_players and self.disconnected_players[disconnected_player]['session_id'] == session_id:
			del self.disconnected_players[disconnected_player]
			if other_players:
				await self.channel_layer.group_send(
					session_id,
					{
						'type': 'game_over',
						'winner': 'Remaining Players'
					}
				)
				await self.close_game_session(session_id, 'Remaining Players')

	async def close_game_session(self, session_id, winner):
		game_session = self.game_sessions.pop(session_id, None)
		if game_session:
			for player_channel in game_session['players'].keys():
				await self.channel_layer.group_discard(session_id, player_channel)
			result = {
				'players': list(game_session['players'].values()),
				'winner': winner,
				'score': game_session['game_state']['score']
			}
			await self.send_game_result(result, session_id, winner)

	async def start_game_countdown(self, session_id):
		await self.channel_layer.group_send(
			session_id,
			{
				'type': 'both_players_joined',
				'message': 'All players joined. Get ready!',
				'names': list(self.game_sessions[session_id]['players'].values())
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
		while len(self.game_sessions[session_id]['players']) == 4:
			self.update_game_state(session_id)
			await self.channel_layer.group_send(
				session_id,
				{
					'type': 'game_state_update',
					'game_state': self.game_sessions[session_id]['game_state']
				}
			)
			await asyncio.sleep(0.033)

	# because the walls are not returning the ball, the ball will go out of 
	# bounds too often, so the score will be updated based on 
	# the last player who touched the ball. so last touch variable is used 
	# to keep track of the last player who touched the ball. 
	# if the ball goes out of bounds, the last touch variable will be None, 
	# and the score will not be updated. the ball will be reset to the 
	# center of the screen and a random direction will be chosen for the ball.

	def update_game_state(self, session_id):
		game_state = self.game_sessions[session_id]['game_state']
		game_state['ball']['x'] += game_state['ball']['dx']
		game_state['ball']['y'] += game_state['ball']['dy']
		game_state['out_of_bounds'] = False
		game_state['goal'] = False
		
		if game_state['ball']['x'] <= 10 and game_state['paddle1'] <= game_state['ball']['y'] <= game_state['paddle1'] + 100:
			game_state['ball']['dx'] *= -1
			game_state['last_touch'] = 'player1'
		elif game_state['ball']['x'] >= 590 and game_state['paddle3'] <= game_state['ball']['y'] <= game_state['paddle3'] + 100:
			game_state['ball']['dx'] *= -1
			game_state['last_touch'] = 'player3'
		elif game_state['ball']['y'] <= 10 and game_state['paddle2'] <= game_state['ball']['x'] <= game_state['paddle2'] + 100:
			game_state['ball']['dy'] *= -1
			game_state['last_touch'] = 'player2'
		elif game_state['ball']['y'] >= 590 and game_state['paddle4'] <= game_state['ball']['x'] <= game_state['paddle4'] + 100:
			game_state['ball']['dy'] *= -1
			game_state['last_touch'] = 'player4'
		if game_state['ball']['x'] < -20 or game_state['ball']['x'] > 600 or game_state['ball']['y'] < -20 or game_state['ball']['y'] > 600:
			if game_state['last_touch'] == None:
				game_state['out_of_bounds'] = True
				pass
			else:
				game_state['score'][game_state['last_touch']] += 1
				game_state['goal'] = True

			game_state['last_touch'] = None
			game_state['ball']['x'] = 295
			game_state['ball']['y'] = 295
			game_state['ball']['dx'] = random.choice([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])
			game_state['ball']['dy'] = random.choice([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])

		if game_state['score']['player1'] >= self.goals_to_win or game_state['score']['player2'] >= self.goals_to_win or game_state['score']['player3'] >= self.goals_to_win or game_state['score']['player4'] >= self.goals_to_win:
			if  game_state['score']['player1'] >= self.goals_to_win:
				winner = list(self.game_sessions[session_id]['players'].values())[0]
			elif game_state['score']['player2'] >= self.goals_to_win:
				winner = list(self.game_sessions[session_id]['players'].values())[1]
			elif game_state['score']['player3'] >= self.goals_to_win:
				winner = list(self.game_sessions[session_id]['players'].values())[2]
			else:
				winner = list(self.game_sessions[session_id]['players'].values())[3]
			result = {
				'players': list(self.game_sessions[session_id]['players'].values()),
				'winner': winner,
				'score': game_state['score']
			}
			asyncio.create_task(self.send_game_result(result, session_id, winner))
	
	# results are not saved to the profiles, just the winner is announced on
	# the screen. the game session is closed after 3 seconds of the game over
	# message.

	async def send_game_result(self, result, session_id, winner):
		await self.channel_layer.group_send(
			session_id,
			{
				'type': 'game_over',
				'winner': winner
			}
		)
		await self.close_game_session(session_id, winner)

	async def both_players_joined(self, event):
		await self.send(text_data=json.dumps({
			'type': 'both_players_joined',
			'message': event['message'],
			'names': event['names']
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
			'opponents': event['opponents']
		}))

	async def countdown(self, event):
		await self.send(text_data=json.dumps({
			'type': 'countdown',
			'message': event['message']
		}))

	async def game_started(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_started'
		}))

	async def game_state_update(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_state_update',
			'game_state': event['game_state']
		}))

	async def game_stop(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_stop',
			'message': event['message']
		}))

	async def game_over(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_over',
			'winner': event['winner']
		}))
		await asyncio.sleep(3)
		await self.close()

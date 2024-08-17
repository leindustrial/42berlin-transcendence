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


#https://channels.readthedocs.io/en/stable/topics/consumers.html
#https://docs.djangoproject.com/en/3.2/topics/auth/default/#user-objects


User = get_user_model() # get the user data model from the Django auth module

class PongConsumer(AsyncWebsocketConsumer):
	game_sessions = {}
	disconnected_players = {}
	rejoin_timeout = 30  # should be changed to a better amount
	dx = 3.5
	dy = 3.5
	fps = 30
	
	
	# 												***	websocket connection handling ***

	# for every new connection, method checks if the user was previously connected or not
	# if yes, then it checks if the user is still within the rejoin timeout period
	# if yes, then it adds the user to the same game session
	# if no, then it creates a new game session


	async def connect(self):
		await self.accept()
		user = self.scope['user']
		if user.is_authenticated:
			if user.username in self.disconnected_players: # handle user reconnection
				session_id = self.disconnected_players[user.username]['session_id']
				print("session id: ", session_id)
				if time.time() < self.disconnected_players[user.username]['rejoin_deadline']:
					rejoin_task = self.disconnected_players[user.username].get('rejoin_task')
					if rejoin_task:
						rejoin_task.cancel()
					self.session_id = session_id
					self.add_player_to_session(session_id, user.username, self.channel_name)
					await self.channel_layer.group_add(session_id, self.channel_name)
					await self.channel_layer.group_send(
						session_id,
						{
							'type': 'player_rejoined',
							'name': user.username,
							'opponent': self.disconnected_players[user.username]['opponent']							
						}
					)
					# delete the player from disconnected, and resume game loop if both players are back
					del self.disconnected_players[user.username]
					print(f"Player {user.username} rejoined session {session_id}")
					if len(self.game_sessions[session_id]['players']) == 2:
						self.resume_game(session_id)
					return
				else:
					del self.disconnected_players[user.username]
					print(f"Rejoin deadline expired for player {user.username}")
					return
		
			# check if the user is already in a game session, if yes, then close the connection with code 3001
			# the close code is used to send a specific close messages to the client
			for session in self.game_sessions.values():
				if user.username in session['players'].values():
					print(f"Player {user.username} has already joined a game session.")
					await self.close(code = 3001)
					return
		
			session_id = self.get_available_session() # handle new user connection
			if session_id:
				self.session_id = session_id
				self.add_player_to_session(session_id, user.username, self.channel_name)
				await self.channel_layer.group_add(session_id, self.channel_name)
				await self.channel_layer.group_send(
					self.session_id,
					{
						'type': 'player_joined',
						'name': user.username
					}
				)
				if len(self.game_sessions[session_id]['players']) == 2:
					self.countdown_task = asyncio.create_task(self.start_game_countdown(session_id))
			else:
				await self.close(code = 3002)
				print("Connection closed: no available game session")
		else:
			await self.close(code = 3003)
			print("Connection closed for unauthenticated user")


	# on disconnect, the method checks if the user was part of a game session, and if yes, then it removes the user from the game session
	# it also adds the user to a list of disconnected players, with a deadline for rejoining the game session
	# if the user does not rejoin within the deadline, the remaining player in the game session is declared the winner
	# the game session is then closed

	async def disconnect(self, close_code):
		if hasattr(self, 'session_id') and self.session_id in self.game_sessions:
			player_name = self.game_sessions[self.session_id]['players'].pop(self.channel_name, None)
			other_player = next(iter(self.game_sessions[self.session_id]['players'].values()), None)
			if player_name:
				rejoin_task = asyncio.create_task(self.check_player_rejoin_timeout(self.session_id, player_name, other_player))
				self.disconnected_players[player_name] = {
					'session_id': self.session_id,
					'rejoin_deadline': time.time() + self.rejoin_timeout,
					'opponent': other_player,
					'rejoin_task': rejoin_task
				}
				await self.channel_layer.group_discard(self.session_id, self.channel_name)
				print(f"Player {player_name} disconnected from session {self.session_id}")
				if 'game_loop_task' in self.game_sessions[self.session_id]:
					if self.game_sessions[self.session_id]['game_loop_task']:
						self.game_sessions[self.session_id]['game_loop_task'].cancel()
						self.game_sessions[self.session_id]['game_loop_task'] = None
				if len(self.game_sessions[self.session_id]['players']) == 0:
					print(f"Game session {self.session_id} closed due to both player disconnection.")
					if player_name in self.disconnected_players:
						for key in list(self.disconnected_players.keys()):
							if self.disconnected_players[key]['session_id'] == self.session_id:
								print(f"Player {key} deleted from disconnected players.")
								del self.disconnected_players[key]
					await self.delete_game_session(self.session_id)
					return
				#asyncio.create_task(self.check_player_rejoin_timeout(self.session_id, player_name, other_player))
				
					


	# 												***	message handling ***

	# method receives messages from the client and processes them, in this case, it moves the paddle up or down
	# based on the key pressed by the player. The method then sends the updated game state to the clients


	async def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'paddle_move':
			await self.move_paddle(data['key'])
		elif data['type'] == 'paddle_stop':
			await self.stop_paddle(data['key'])

	async def move_paddle(self, key):
		user = self.scope['user']
		try:
			if user.username == list(self.game_sessions[self.session_id]['players'].values())[1]:
				paddle = 'paddle1'
			else:
				paddle = 'paddle2'
			if key == 'ArrowUp' and self.game_sessions[self.session_id]['game_state'][paddle] > 5:
				self.game_sessions[self.session_id]['game_state'][paddle] -= 15
			elif key == 'ArrowDown' and self.game_sessions[self.session_id]['game_state'][paddle] < 485:
				self.game_sessions[self.session_id]['game_state'][paddle] += 15
		except Exception as e:
			print(f"Error exception moving paddle: {e}")

	async def stop_paddle(self, key):
		user = self.scope['user']
		try:
			if user.username == list(self.game_sessions[self.session_id]['players'].values())[1]:
				paddle = 'paddle1'
			else:
				paddle = 'paddle2'
			if key == 'ArrowUp':
				self.game_sessions[self.session_id]['game_state'][paddle] = 0
			elif key == 'ArrowDown':
				self.game_sessions[self.session_id]['game_state'][paddle] = 0
		except Exception as e:
			print(f"Error exception moving paddle: {e}")



	# 														***	session management ***

	# a game session is a dictionary that contains the players in the session, the game state, and the game loop task
	# method checks for available game sessions, if none are available, it creates a new game session.
	# the other method adds the player to the game session

	def get_available_session(self):
		for session_id, session in self.game_sessions.items():
			if len(session['players']) < 2:
				return session_id
		#new_session_id = f"game_session_{len(self.game_sessions) + 1}"
		new_session_id = f"game_session_{uuid.uuid4()}"
		self.game_sessions[new_session_id] = {
			'players': {},
			'game_state': {
				'ball': {'x': 450, 'y': 290, 'dx': self.dx, 'dy': self.dy},
				'paddle1': 260,
				'paddle2': 260,
				'score': {'player1': 0, 'player2': 0},
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

	# check if the player has reconnected within the timeout period and it's name is deleted from disconnected players, and if not, declare the remaining player as the winner
	# and close the game session

	async def check_player_rejoin_timeout(self, session_id, disconnected_player, other_player):
		try:
			if len(self.game_sessions[session_id]['players']) == 1:
				await self.channel_layer.group_send(
					self.session_id,
					{
						'type': 'game_stop',
						'message': f"wait till {self.rejoin_timeout} seconds for the opponent to rejoin..."
					}
				)
			print (self.disconnected_players)
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
		except Exception as e:
			print(f"Error exception checking player rejoin timeout: {e}")

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
				print(f"Game session {session_id} closed. Winner: {winner}")

	async def delete_game_session(self, session_id):
			game_session = self.game_sessions.pop(session_id, None)
			if game_session:
				for player_channel in game_session['players'].keys():
					await self.channel_layer.group_discard(session_id, player_channel)



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
					'message': f"{i}"
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
		try:
			while len(self.game_sessions[session_id]['players']) == 2:
				self.update_game_state(session_id)
				await self.channel_layer.group_send(
					session_id,
					{
						'type': 'game_state_update',
						'game_state': self.game_sessions[session_id]['game_state']
					}
				)
				game_state = self.game_sessions[session_id]['game_state']
				if game_state['goal']:
					await asyncio.sleep(2)
				else:
					await asyncio.sleep(1/self.fps)
		except Exception as e:
			print(f"Error exception in game loop: {e}")

	def update_game_state(self, session_id):
		game_state = self.game_sessions[session_id]['game_state']
		game_state['goal'] = False

		game_state['ball']['x'] += game_state['ball']['dx']
		game_state['ball']['y'] += game_state['ball']['dy']

		if game_state['ball']['y'] <= 0 or game_state['ball']['y'] >= 570:
			game_state['ball']['dy'] *= -1

		if (game_state['ball']['x'] <= 15 and game_state['paddle1'] <= game_state['ball']['y'] <= game_state['paddle1'] + 100):
			game_state['ball']['dx'] *= -1
		elif (game_state['ball']['x'] >= 855 and game_state['paddle2'] <= game_state['ball']['y'] <= game_state['paddle2'] + 100):
			game_state['ball']['dx'] *= -1

		if game_state['ball']['x'] <= 0:
			game_state['score']['player2'] += 1
			game_state['goal'] = True
			self.reset_ball(session_id)
		elif game_state['ball']['x'] >= 870:
			game_state['score']['player1'] += 1
			game_state['goal'] = True
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
		game_state['ball']['dx'] = random.choice([-1 * self.dx, self.dx])
		game_state['ball']['dy'] = random.choice([-1 * self.dy, self.dy])

		
	def reset_game(self, session_id):
		self.game_sessions[session_id]['game_state'] = {
			'ball': {'x': 450, 'y': 290, 'dx': self.dx, 'dy': self.dy},
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
		try:
			await self.send(text_data=json.dumps({
				'type': 'game_state',
				'game_state': event['game_state']
			}))
		except Exception as e:
			print(f"Error exception sending game state update: {e}")
		
	async def player_joined(self, event):
		try:
			await self.send(text_data=json.dumps({
				'type': 'player_joined',
				'name': event['name']
			}))
		except Exception as e:
			print(f"Error exception sending player joined: {e}")

	async def player_rejoined(self, event):
		try:
			await self.send(text_data=json.dumps({
				'type': 'player_rejoined',
				'name': event['name'],
				'opponent': event['opponent']
			}))
		except Exception as e:
			print(f"Error exception sending player rejoined: {e}")
		
	async def both_players_joined(self, event):
		try:
			await self.send(text_data=json.dumps({
				'type': 'both_players_joined',
				'message': 'Both players joined. Get ready!',
				'name': event['name']
			}))
		except Exception as e:
			print(f"Error exception sending both players joined: {e}")
		
	async def countdown(self, event):
		try:
			await self.send(text_data=json.dumps({
				'type': 'countdown',
				'message': event['message']
			}))
		except Exception as e:
			print(f"Error exception sending countdown: {e}")
		
	async def game_over(self, event):
		try:
			await self.send(text_data=json.dumps({
				'type': 'game_over',
				'winner': event['winner']
			}))
			await asyncio.sleep(2)
			await self.close()
		except Exception as e:
			print(f"Error exception sending game over: {e}")
		
	async def game_started(self, event):
		try:
			await self.send(text_data=json.dumps({
				'type': 'game_started',
				'message': 'Game started!'
			}))
		except Exception as e:
			print(f"Error exception sending game started: {e}")

	async def game_stop(self, event):
		try:
			await self.send(text_data=json.dumps({
				'type': 'game_stop',
				'message': event['message']
			}))
		except Exception as e:
			print(f"Error exception sending game stop: {e}")



	# 															***	game result ***

	# method sends the game result to the clients, through accessing the profile model and updating the player's stats, also creates a history string
	# which is being parsed inside the model to update the player's game history. @sync_to_async is used to make the database queries asynchronous
	# the method then sends a message to the clients to inform them of the game result, that is being shown on the page at the end of the game


	async def send_game_result(self, result, session_id, winner):
		try:
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
		except Exception as e:
			print(f"Error exception sending game result: {e}")
	
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

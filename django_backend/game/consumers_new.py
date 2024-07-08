import json
import asyncio
import random
from channels.generic.websocket import AsyncWebsocketConsumer

#https://channels.readthedocs.io/en/stable/topics/consumers.html
#https://docs.djangoproject.com/en/3.2/topics/auth/default/#user-objects

class PongConsumer(AsyncWebsocketConsumer):
	game_sessions = {}

	# websocket connection handling
	async def connect(self):
		await self.accept()
		user = self.scope['user']
		if user.is_authenticated:
			session_id = self.get_available_session()
			if session_id:
				self.session_id = session_id
				self.add_player_to_session(session_id, user.username)
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
		# views for the respective closed connections to be added
			else:
				await self.close()
				print("Connection closed: no available game sessions")
		else:
			# await self.send_json({
            #     'type': 'redirect',
            #     'url': '/'
            # })
			await self.close()
			print("Connection closed for unauthenticated user")
	
	async def disconnect(self, close_code):
		if hasattr(self, 'session_id') and self.session_id in self.game_sessions:
			player_name = self.game_sessions[self.session_id]['players'].pop(self.channel_name, None)
			await self.channel_layer.group_discard(self.session_id, self.channel_name)
			print(f"Player {player_name} disconnected from session {self.session_id}")
			if len(self.game_sessions[self.session_id]['players']) == 0:
				self.game_sessions.pop(self.session_id, None)

	# message handling
	async def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'paddle_move':
			await self.move_paddle(data['key'])

	async def move_paddle(self, key):
		user = self.scope['user']
		if user.username == list(self.game_sessions[self.session_id]['players'].values())[0]:
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
		for i in range(5, 0, -1):
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

		if game_state['score']['player1'] >= 3 or game_state['score']['player2'] >=3:
			winner = list(self.game_sessions[session_id]['players'].values())[0] if game_state['score']['player1'] >= 3 else list(self.game_sessions[session_id]['players'].values())[1]
			result = {
				'players': list(self.game_sessions[session_id]['players'].values()),
				'winner': winner,
				'score': game_state['score']
			}
			asyncio.create_task(self.channel_layer.group_send(
				session_id,
				{
					'type': 'game_over',
					'winner': winner
				}
			))
			asyncio.create_task(self.send_game_result(result, session_id))
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
		self.close()
		
	async def game_started(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_started',
			'message': 'Game started!'
		}))

	# sending back the game result. to be developed ...	
	async def send_game_result(self, result, session_id):
		print(f"Game result: {result}")
		user = self.scope['user']
		
import json
import asyncio
import random
from channels.generic.websocket import AsyncWebsocketConsumer

class PongConsumer(AsyncWebsocketConsumer):
	game_sessions = {}

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
				if len(self.game_sessions[session_id]['players']) == 4:
					self.countdown_task = asyncio.create_task(self.start_game_countdown(session_id))
			else:
				await self.close()
				print("Connection closed: no available game sessions")
		else:
			await self.close()
			print("Connection closed for unauthenticated user")

	async def disconnect(self, close_code):
		user = self.scope['user']
		session = self.game_sessions[self.session_id]
		if user.username in session['team1'].values():
			team = 'team1'
		else:
			team = 'team2'
		player_key = [k for k, v in session[team].items() if v == user.username][0]
		session[team].pop(player_key)
		session['players'].pop(self.channel_name, None)
		await self.channel_layer.group_discard(self.session_id, self.channel_name)
		print(f"Player {user.username} disconnected from session {self.session_id}")
		if len(session['players']) == 0:
			self.game_sessions.pop(self.session_id, None)

	async def receive(self, text_data):
		data = json.loads(text_data)
		if data['type'] == 'paddle_move':
			await self.move_paddle(data['key'])

	async def move_paddle(self, key):
		user = self.scope['user']
		session = self.game_sessions[self.session_id]
		game_state = session['game_state']

		if user.username == list(session['team1'].values())[0]:
			paddle = 'paddle1'
			#print("Paddle 1:", user.username)
		elif user.username == list(session['team1'].values())[1]:
			paddle = 'paddle3'
			#print("Paddle 3:", user.username)
		elif user.username == list(session['team2'].values())[0]:
			paddle = 'paddle2'
			#print("Paddle 2:", user.username)
		else:
			paddle = 'paddle4'
			#print("Paddle 4:", user.username)
			   
		if key == 'ArrowUp' and game_state[paddle] > 0:
			game_state[paddle] -= 10
		elif key == 'ArrowDown' and game_state[paddle] < 320:
			game_state[paddle] += 10
	   
		await self.channel_layer.group_send(
			self.session_id,
			{
				'type': 'game_state_update',
				'game_state': game_state
			}
		)

	def get_available_session(self):
		for session_id, session in self.game_sessions.items():
			if len(session['players']) < 4:
				return session_id
		new_session_id = f"game_session_{len(self.game_sessions) + 1}"
		self.game_sessions[new_session_id] = {
			'players': {},
			'team1': {},
			'team2': {},
			'game_state': {
				'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
				'paddle1': 160,
				'paddle2': 160,
				'paddle3': 160,
				'paddle4': 160,
				'score': {'team1': 0, 'team2': 0}
			},
			'game_loop_task': None
		}
		return new_session_id

	def add_player_to_session(self, session_id, username):
		session = self.game_sessions[session_id]
		if len(session['team1']) < 2:
			player_key = f"player{len(session['team1']) + 1}"
			session['team1'][player_key] = username
		elif len(session['team2']) < 2:
			player_key = f"player{len(session['team2']) + 1}"
			session['team2'][player_key] = username
		session['players'][self.channel_name] = username

	async def start_game_countdown(self, session_id):
		session = self.game_sessions[session_id]
		team1_names = list(session['team1'].values())
		team2_names = list(session['team2'].values())
		print(f"Teams in session {session_id}: Team 1 - {team1_names}, Team 2 - {team2_names}")

		await self.channel_layer.group_send(
			session_id,
			{
				'type': 'both_players_joined',
				'message': 'Both teams joined. Get ready!',
				'team1_name': ', '.join(team1_names),
				'team2_name': ', '.join(team2_names)
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
		session['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))

	async def game_loop(self, session_id):
		session = self.game_sessions[session_id]
		while len(session['players']) == 4:
			self.update_game_state(session_id)
			await self.channel_layer.group_send(
				session_id,
				{
					'type': 'game_state_update',
					'game_state': session['game_state']
				}
			)
			await asyncio.sleep(0.033)

	def update_game_state(self, session_id):
		game_state = self.game_sessions[session_id]['game_state']

		game_state['ball']['x'] += game_state['ball']['dx']
		game_state['ball']['y'] += game_state['ball']['dy']

		if game_state['ball']['y'] <= 0 or game_state['ball']['y'] >= 400:
			game_state['ball']['dy'] *= -1

		if (game_state['ball']['x'] == 20 and (game_state['paddle1'] <= game_state['ball']['y'] <= game_state['paddle1'] + 80)):
			game_state['ball']['dx'] *= -1
		elif ((game_state['ball']['x'] == 80) and (game_state['paddle3'] <= game_state['ball']['y'] <= game_state['paddle3'] + 80)):
			game_state['ball']['dx'] *= -1
		elif ((game_state['ball']['x'] == 720) and (game_state['paddle2'] <= game_state['ball']['y'] <= game_state['paddle2'] + 80)):
			game_state['ball']['dx'] *= -1
		elif (game_state['ball']['x'] == 780 and (game_state['paddle4'] <= game_state['ball']['y'] <= game_state['paddle4'] + 80)):
			game_state['ball']['dx'] *= -1
		
		if game_state['ball']['x'] <= 0:
			game_state['score']['team2'] += 1
			self.reset_ball(session_id)
		elif game_state['ball']['x'] >= 800:
			game_state['score']['team1'] += 1
			self.reset_ball(session_id)
		
		if game_state['score']['team1'] >= 3 or game_state['score']['team2'] >= 3:
			winner = 'Team 1' if game_state['score']['team1'] >= 3 else 'Team 2'
			result = {
				'teams': {
					'team1': list(self.game_sessions[session_id]['team1'].values()),
					'team2': list(self.game_sessions[session_id]['team2'].values())
				},
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
		session = self.game_sessions[session_id]
		session['game_state'] = {
			'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
			'paddle1': 160,
			'paddle2': 160,
			'paddle3': 160,
			'paddle4': 160,
			'score': {'team1': 0, 'team2': 0}
		}
		session['team1'] = {}
		session['team2'] = {}
		if session['game_loop_task']:
			session['game_loop_task'].cancel()
			session['game_loop_task'] = None

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
			'message': event['message'],
			'team1_name': event['team1_name'],
			'team2_name': event['team2_name']
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

	async def game_over(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_over',
			'winner': event['winner']
		}))

	async def send_game_result(self, result, session_id):
		for channel_name in self.game_sessions[session_id]['players']:
			await self.channel_layer.send(channel_name, {
				'type': 'game_result',
				'result': result
			})
	
	async def game_result(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_result',
			'result': event['result']
		}))

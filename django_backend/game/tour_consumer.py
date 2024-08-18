import json
import uuid
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from channels.db import database_sync_to_async
import logging

logger = logging.getLogger('django')

class TournamentConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = self.scope['user']
		self.room_group_name = 'tournament'
		await self.accept()
		active_players = cache.get('active_players', [])
		loosers = cache.get('loosers', [])
		#print('active_players', active_players)
		logger.info(f'active_players: {active_players}')
		if self.user.username in active_players:
			pass
		elif len(active_players) >= 4:
			#print('Tournament is full')
			logger.info('Tournament is full')
			await self.close(code = 3002)
			return
		
		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		if self.user.username not in active_players:
			await self.add_active_player()
		print('active_players after', active_players)
		player_in_game = cache.get('player_in_game', [])
		if self.user.username in player_in_game:
			print('player was in game')
			player_in_game.remove(self.user.username)
			cache.set('player_in_game', player_in_game, timeout=3600)
		print('player_in_game', player_in_game)
		await self.update_tournament_status()

	async def disconnect(self, close_code):
		if self.user.username not in cache.get('active_players', []):
			return
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)
		player_in_game = cache.get('player_in_game', [])
		loosers = cache.get('loosers', [])
		#print('player_in_game', player_in_game)
		logger.info(f'player_in_game: {player_in_game}')
		if self.user.username in player_in_game or self.user.username in loosers:
			print('pass')
			pass
		else:
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'go_back_to_home',
					'content': {'type': 'go_back_to_home'},
					'message': 'tornument end due to exit of a player. you may exit now'
				}
			)
			cache.delete('tournament')
			cache.delete('player_in_game')
			cache.delete('active_players')
			cache.delete('loosers')
			logger.info('player left the game so tournament ended')
			
	
	async def receive(self, text_data):
		data = json.loads(text_data)
		if data.get('action') == 'going_to_game':
			await self.add_player_to_game(data['username'])

	@database_sync_to_async
	def add_player_to_game(self, player):
		player_in_game = cache.get('player_in_game', [])
		player_in_game.append(player)
		cache.set('player_in_game', player_in_game, timeout=3600)

	@database_sync_to_async
	def add_active_player(self):
		active_players = cache.get('active_players', [])
		active_players.append(self.user.username)
		cache.set('active_players', active_players, timeout=3600)

	@database_sync_to_async
	def remove_active_player(self):
		active_players = cache.get('active_players', [])
		if self.user.username in active_players:
			active_players.remove(self.user.username)
			cache.set('active_players', active_players, timeout=3600)
			return True
		return False

	@database_sync_to_async
	def end_tournament(self):
		asyncio.sleep(5)
		cache.delete('tournament')
		cache.delete('player_in_game')
		cache.delete('active_players')
		cache.delete('loosers')
		

	@database_sync_to_async
	def assign_player_to_match(self):
		tournament = cache.get('tournament')
		if tournament is None:
			print('tournament is being created')
			tournament = {
				'semi_finals': [
					{'player1': None, 'player2': None, 'session_id': str(uuid.uuid4()), 'winner': None},
					{'player1': None, 'player2': None, 'session_id': str(uuid.uuid4()), 'winner': None}
				],
				'final': {'player1': None, 'player2': None, 'session_id': str(uuid.uuid4()), 'winner': None}
			}

		player_positions = [
			('semi_finals', 0, 'player1'),
			('semi_finals', 0, 'player2'),
			('semi_finals', 1, 'player1'),
			('semi_finals', 1, 'player2'),
			('final', 0, 'player1'),
			('final', 0, 'player2'),
		]

		user_position = None
		
		for round_type, match_index, player_key in player_positions:
			if tournament['semi_finals'][match_index][player_key] == self.user.username:
				user_position = (round_type, match_index, player_key)
				break

		if user_position is None:
			for pos in player_positions:
				if tournament[pos[0]][pos[1]][pos[2]] is None:
					round_type, match_index, player_key = pos
					tournament[round_type][match_index][player_key] = self.user.username
					user_position = pos
					break
			cache.set('tournament', tournament, timeout=3600)

		if tournament['semi_finals'][0]['winner'] == self.user.username:
				tournament['final']['player1'] = self.user.username
				cache.set('tournament', tournament, timeout=3600)
				print('match 1 winner set in final position 1')
				#logger.info('match 1 winner set in final position 1')
		if tournament['semi_finals'][1]['winner'] == self.user.username:
				tournament['final']['player2'] = self.user.username
				cache.set('tournament', tournament, timeout=3600)
				print('match 2 winner set in final position 2')
				#logger.info('match 2 winner set in final position 2')
		
		return tournament, user_position

	async def update_tournament_status(self):
		tournament, user_position = await self.assign_player_to_match()

		context = {
			'type': 'update_tournament_chart',
			'tournament': tournament,
			'user': self.user.username,
			'champion': None,
		}

		to_game = {
			'type': 'go_to_game',
			'tournament': tournament,
			'session_id': None,
			'players': None,
			'game_ready': False,
		}

		if tournament['semi_finals'][0]['player1'] and tournament['semi_finals'][0]['player2'] and not tournament['semi_finals'][0]['winner']:
			to_game['game_ready'] = True
			to_game['players'] = [tournament['semi_finals'][0]['player1'], tournament['semi_finals'][0]['player2']]
			to_game['session_id'] = tournament['semi_finals'][0]['session_id']
		if tournament['semi_finals'][1]['player1'] and tournament['semi_finals'][1]['player2'] and not tournament['semi_finals'][1]['winner']:
			to_game['game_ready'] = True
			to_game['players'] = [tournament['semi_finals'][1]['player1'], tournament['semi_finals'][1]['player2']]
			to_game['session_id'] = tournament['semi_finals'][1]['session_id']

		if tournament['final']['player1'] and tournament['final']['player2'] and not tournament['final']['winner']:
			to_game['game_ready'] = True
			to_game['players'] = [tournament['final']['player1'], tournament['final']['player2']]
			to_game['session_id'] = tournament['final']['session_id']
		elif tournament['final']['winner']:
			to_game['game_ready'] = False
			to_game['players'] = None
			to_game['session_id'] = None
			context['champion'] = tournament['final']['winner']
			print('Champion is: ', context['champion'])
			#logger.info(f'Champion is: {context["champion"]}')
			
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'update_tournament_chart',
				'content': context
			}
		)

		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'go_to_game',
				'content': to_game
			}
		)
		
		if context['champion']:
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'go_back_to_home',
					'message': 'Tournament ended. You may go back to home'
				}
			)
			await asyncio.sleep(2)
			cache.delete('tournament')
	
	async def update_tournament_chart(self, event):
		print('update_tournament_chart')
		#logger.info('update_tournament_chart')
		await self.send(text_data=json.dumps(event['content']))

	async def go_to_game(self, event):
		if event['content']['players'] is not None and self.user.username in event['content']['players']:
			await self.send(text_data=json.dumps(event['content']))
		
	async def go_back_to_home(self, event):
		await self.send(text_data=json.dumps({'type': 'go_back_to_home',
		'message': event['message']					
		}))

	def count_semi_final_players(self, tournament):
		count = 0
		for match in tournament['semi_finals']:
			if match['player1'] and match['player2']:
				count += 1
		return count



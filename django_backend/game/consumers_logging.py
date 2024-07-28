import os
import django
import json
import asyncio
import random
import time
import uuid
import logging
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from users.models import Profile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong_game.settings')
django.setup()

logger = logging.getLogger('django')
User = get_user_model()

class PongConsumer(AsyncWebsocketConsumer):
    game_sessions = {}
    disconnected_players = {}
    rejoin_timeout = 10  # should be changed to a better amount

    async def connect(self):
        try:
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
                                'opponent': self.disconnected_players[user.username]['opponent']
                            }
                        )
                        del self.disconnected_players[user.username]
                        logger.info(f"Player {user.username} rejoined session {session_id}")
                        if len(self.game_sessions[session_id]['players']) == 2:
                            self.resume_game(session_id)
                        return
                    else:
                        del self.disconnected_players[user.username]
                        logger.info(f"Rejoin deadline expired for player {user.username}")
                        return

                for session in self.game_sessions.values():
                    if user.username in session['players'].values():
                        await self.close(code=3001)
                        logger.info(f"Player {user.username} has already joined a game session.")
                        return

                session_id = self.get_available_session()
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
                    await self.close(code=3002)
                    logger.info("Connection closed: no available game session")
            else:
                await self.close(code=3003)
                logger.info("Connection closed for unauthenticated user")
        except Exception as e:
            logger.error(f"Error in connect: {e}")

    async def disconnect(self, close_code):
        try:
            if hasattr(self, 'session_id') and self.session_id in self.game_sessions:
                player_name = self.game_sessions[self.session_id]['players'].pop(self.channel_name, None)
                other_player = next(iter(self.game_sessions[self.session_id]['players'].values()), None)
                if player_name:
                    self.disconnected_players[player_name] = {
                        'session_id': self.session_id,
                        'rejoin_deadline': time.time() + self.rejoin_timeout,
                        'opponent': other_player
                    }
                    await self.channel_layer.group_discard(self.session_id, self.channel_name)
                    logger.info(f"Player {player_name} disconnected from session {self.session_id}")
                    if 'game_loop_task' in self.game_sessions[self.session_id]:
                        if self.game_sessions[self.session_id]['game_loop_task']:
                            self.game_sessions[self.session_id]['game_loop_task'].cancel()
                            self.game_sessions[self.session_id]['game_loop_task'] = None
                    asyncio.create_task(self.check_player_rejoin_timeout(self.session_id, player_name, other_player))
        except Exception as e:
            logger.error(f"Error in disconnect: {e}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data['type'] == 'paddle_move':
                await self.move_paddle(data['key'])
        except Exception as e:
            logger.error(f"Error in receive: {e}")

    async def move_paddle(self, key):
        try:
            user = self.scope['user']
            paddle = 'paddle1' if user.username == list(self.game_sessions[self.session_id]['players'].values())[1] else 'paddle2'
            if key == 'ArrowUp' and self.game_sessions[self.session_id]['game_state'][paddle] > 0:
                self.game_sessions[self.session_id]['game_state'][paddle] -= 10
            elif key == 'ArrowDown' and self.game_sessions[self.session_id]['game_state'][paddle] < 500:
                self.game_sessions[self.session_id]['game_state'][paddle] += 10
        except Exception as e:
            logger.error(f"Error in move_paddle: {e}")

    def get_available_session(self):
        try:
            for session_id, session in self.game_sessions.items():
                if len(session['players']) < 2:
                    return session_id
            new_session_id = f"game_session_{uuid.uuid4()}"
            self.game_sessions[new_session_id] = {
                'players': {},
                'game_state': {
                    'ball': {'x': 450, 'y': 290, 'dx': 5, 'dy': 5},
                    'paddle1': 260,
                    'paddle2': 260,
                    'score': {'player1': 0, 'player2': 0}
                },
                'game_loop_task': None
            }
            return new_session_id
        except Exception as e:
            logger.error(f"Error in get_available_session: {e}")

    def add_player_to_session(self, session_id, username, channel_name):
        try:
            self.game_sessions[session_id]['players'][channel_name] = username
        except Exception as e:
            logger.error(f"Error in add_player_to_session: {e}")

    def resume_game(self, session_id):
        try:
            if 'game_loop_task' not in self.game_sessions[session_id] or self.game_sessions[session_id]['game_loop_task'] is None:
                self.game_sessions[session_id]['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))
        except Exception as e:
            logger.error(f"Error in resume_game: {e}")

    async def check_player_rejoin_timeout(self, session_id, disconnected_player, other_player):
        try:
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
                    logger.info(f"Player {disconnected_player} did not rejoin in time. {other_player} wins by default.")
                    await self.close_game_session(session_id, other_player)
        except Exception as e:
            logger.error(f"Error in check_player_rejoin_timeout: {e}")

    async def close_game_session(self, session_id, winner):
        try:
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
                logger.info(f"Game session {session_id} closed. Winner: {winner}")
        except Exception as e:
            logger.error(f"Error in close_game_session: {e}")

    async def start_game_countdown(self, session_id):
        try:
            user = self.scope['user']
            player_list = list(self.game_sessions[session_id]['players'].values())
            opponent = player_list[1] if user.username == player_list[0] else player_list[0]
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
                        'message': f'{i}'
                    }
                )
                await asyncio.sleep(1)
            self.game_sessions[session_id]['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))
        except Exception as e:
            logger.error(f"Error in start_game_countdown: {e}")

    async def game_loop(self, session_id):
        try:
            while True:
                game_state = self.game_sessions[session_id]['game_state']
                ball = game_state['ball']
                ball['x'] += ball['dx']
                ball['y'] += ball['dy']

                if ball['y'] <= 0 or ball['y'] >= 580:
                    ball['dy'] = -ball['dy']

                if ball['x'] <= 10 and game_state['paddle1'] <= ball['y'] <= game_state['paddle1'] + 100:
                    ball['dx'] = -ball['dx']

                if ball['x'] >= 880 and game_state['paddle2'] <= ball['y'] <= game_state['paddle2'] + 100:
                    ball['dx'] = -ball['dx']

                if ball['x'] <= 0:
                    game_state['score']['player2'] += 1
                    ball.update({'x': 450, 'y': 290, 'dx': 5, 'dy': 5})

                if ball['x'] >= 900:
                    game_state['score']['player1'] += 1
                    ball.update({'x': 450, 'y': 290, 'dx': -5, 'dy': 5})

                await self.channel_layer.group_send(
                    session_id,
                    {
                        'type': 'update_game_state',
                        'game_state': game_state
                    }
                )
                await asyncio.sleep(0.02)
        except Exception as e:
            logger.error(f"Error in game_loop: {e}")

    async def send_game_result(self, result, session_id, winner):
        try:
            await self.channel_layer.group_send(
                session_id,
                {
                    'type': 'game_over',
                    'message': f'Game over! {winner} wins!',
                    'result': result
                }
            )
        except Exception as e:
            logger.error(f"Error in send_game_result: {e}")

    async def player_joined(self, event):
        try:
            user = self.scope['user']
            await self.send(text_data=json.dumps({
                'type': 'player_joined',
                'message': f'{event["name"]} joined the game'
            }))
        except Exception as e:
            logger.error(f"Error in player_joined: {e}")

    async def player_rejoined(self, event):
        try:
            await self.send(text_data=json.dumps({
                'type': 'player_rejoined',
                'message': f'{event["name"]} rejoined the game'
            }))
        except Exception as e:
            logger.error(f"Error in player_rejoined: {e}")

    async def update_game_state(self, event):
        try:
            await self.send(text_data=json.dumps({
                'type': 'update_game_state',
                'game_state': event['game_state']
            }))
        except Exception as e:
            logger.error(f"Error in update_game_state: {e}")

    async def countdown(self, event):
        try:
            await self.send(text_data=json.dumps({
                'type': 'countdown',
                'message': event['message']
            }))
        except Exception as e:
            logger.error(f"Error in countdown: {e}")

    async def game_stop(self, event):
        try:
            await self.send(text_data=json.dumps({
                'type': 'game_stop',
                'message': event['message']
            }))
        except Exception as e:
            logger.error(f"Error in game_stop: {e}")

    async def game_over(self, event):
        try:
            await self.send(text_data=json.dumps({
                'type': 'game_over',
                'message': event['message'],
                'result': event.get('result', {})
            }))
        except Exception as e:
            logger.error(f"Error in game_over: {e}")

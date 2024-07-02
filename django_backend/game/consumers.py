import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random

class PongConsumer(AsyncWebsocketConsumer):
    players = {}
    game_state = {
        'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
        'paddle1': 160,
        'paddle2': 160,
        'score': {'player1': 0, 'player2': 0}
    }
    game_loop_task = None

    # handle websocket connection

    async def connect(self):
        await self.accept()
        user = self.scope['user']
        if user.is_authenticated:
            if len(self.players) < 2:
                self.players[self.channel_name] = user.username
                await self.channel_layer.group_add('pong_game', self.channel_name)
                await self.channel_layer.group_send(
                    'pong_game',
                    {
                        'type': 'player_joined',
                        'name': user.username
                    }
                )
                if len(self.players) == 2:
                    #await asyncio.sleep(5)
                    #await self.start_game_countdown()

    # create a task to start the game countdown, so that the connect method can return immediately
                    self.countdown_task = asyncio.create_task(self.start_game_countdown())
                   
            else:
                await self.close()
                print("Connection closed: game is full")
        else:
            await self.close()
            print("Connection closed for unauthenticated user")

    async def disconnect(self, close_code):
        if self.channel_name in self.players:
            player_name = self.players[self.channel_name]
            del self.players[self.channel_name]
            await self.channel_layer.group_discard('pong_game', self.channel_name)
            print(f"Player {player_name} disconnected")
        if len(self.players) == 0 and self.game_loop_task:
            self.game_loop_task.cancel()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'paddle_move':
            await self.move_paddle(data['key'])
    
    # game logic

    async def move_paddle(self, key):
        user = self.scope['user']
        paddle = 'paddle1' if user.username == list(self.players.values())[0] else 'paddle2'
        if key == 'ArrowUp' and self.game_state[paddle] > 0:
            self.game_state[paddle] -= 10
        elif key == 'ArrowDown' and self.game_state[paddle] < 300:
            self.game_state[paddle] += 10

    async def start_game_countdown(self):
        user = self.scope['user']
        if user.username == list(self.players.values())[0]:
            oponent = list(self.players.values())[1]
        else:
            oponent = list(self.players.values())[0]
        print(oponent)
        await self.channel_layer.group_send(
            'pong_game',
            {
                'type': 'both_players_joined',
                'name': oponent      
            }
        )
        await asyncio.sleep(2)
        for i in range(5, 0, -1):
            await self.channel_layer.group_send(
                'pong_game',
                {
                    'type': 'countdown',
                    'message': f"Game starts in {i} seconds..."
                }
            )
            await asyncio.sleep(1)
        await self.channel_layer.group_send(
            'pong_game',
            {
                'type': 'game_started'
            }
        )
        self.game_loop_task = asyncio.create_task(self.game_loop())

    async def game_loop(self):
        while len(self.players) == 2:
            self.update_game_state()
            await self.channel_layer.group_send(
                'pong_game',
                {
                    'type': 'game_state_update',
                    'game_state': self.game_state
                }
            )
            await asyncio.sleep(0.033)  # frame per second refresh rate

    def update_game_state(self):
        self.game_state['ball']['x'] += self.game_state['ball']['dx']
        self.game_state['ball']['y'] += self.game_state['ball']['dy']

        if self.game_state['ball']['y'] <= 0 or self.game_state['ball']['y'] >= 380:
            self.game_state['ball']['dy'] *= -1

        if (self.game_state['ball']['x'] <= 20 and 
            self.game_state['paddle1'] <= self.game_state['ball']['y'] <= self.game_state['paddle1'] + 80):
            self.game_state['ball']['dx'] *= -1
        elif (self.game_state['ball']['x'] >= 760 and 
              self.game_state['paddle2'] <= self.game_state['ball']['y'] <= self.game_state['paddle2'] + 80):
            self.game_state['ball']['dx'] *= -1

        if self.game_state['ball']['x'] <= 0:
            self.game_state['score']['player2'] += 1
            self.reset_ball()
        elif self.game_state['ball']['x'] >= 780:
            self.game_state['score']['player1'] += 1
            self.reset_ball()

        if self.game_state['score']['player1'] >= 3 or self.game_state['score']['player2'] >= 3:
            winner = list(self.players.values())[0] if self.game_state['score']['player1'] >= 3 else list(self.players.values())[1]
            result = {
                'players': list(self.players.values()),
                'winner': winner,
                'score': self.game_state['score']
            }
            asyncio.create_task(self.channel_layer.group_send(
                'pong_game',
                {
                    'type': 'game_over',
                    'winner': winner
                }
            ))
            asyncio.create_task(self.send_game_result(result))
            self.reset_game()

    def reset_ball(self):
        self.game_state['ball']['x'] = 390
        self.game_state['ball']['y'] = 190
        self.game_state['ball']['dx'] = random.choice([-5, 5])
        self.game_state['ball']['dy'] = random.choice([-5, 5])

    def reset_game(self):
        self.game_state = {
            'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
            'paddle1': 160,
            'paddle2': 160,
            'score': {'player1': 0, 'player2': 0}
        }
        self.players = {}
        if self.game_loop_task:
            self.game_loop_task.cancel()
            self.game_loop_task = None
        
    # send game events to clients

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
        # print (event['message'])
        await self.send(text_data=json.dumps({
            'type': 'countdown',
            'message': event['message']
        }))

    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_over',
            'winner': event['winner']
        }))
        # print("Game over")
        await self.close()
        
    async def game_started(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_started',
            'message': 'Game started!'
        }))
        
    async def send_game_result(self, result):
        # to be implemented: save game result to database
        print(f"Game result: {result}")
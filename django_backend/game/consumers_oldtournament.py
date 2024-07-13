import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import asyncio
import random
# from users.models import Profile
# group names:
# lobby, group1, group2, final
# I think players variable is a dictionary (key value pair key: self.channel_name value: user.username

class TournamentConsumer(AsyncWebsocketConsumer):
    players = {}
    group1 = {}
    group2 = {}
    final = {}
    looser = {}
    game_state_group1 = {
        'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
        'paddle1': 160,
        'paddle2': 160,
        'score': {'player1': 0, 'player2': 0}
    }
    game_state_group2 = {
        'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
        'paddle1': 160,
        'paddle2': 160,
        'score': {'player1': 0, 'player2': 0}
    }
    game_loop_group1 = None
    game_loop_group2 = None
    task1 = None
    task2 = None


    async def connect(self):
        await self.accept()
        user = self.scope['user']
        self.user = user
        self.group_name = 'lobby'
        self.user_display_name = self.scope['url_route']['kwargs']['display_name']
        print(json.dumps(self.players, indent=4))

        if user.is_authenticated:
            if len(self.players) < 4:
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                self.players[self.channel_name] = user.username
                missing = 4 - len(self.players)
                await self.channel_layer.group_send(
                    'lobby',
                    {
                        'type': 'player_joined',
                        'name': missing
                    }
                )
                await asyncio.sleep(1)
                if len(self.players) == 4:
                    print('4 players')
                    print(json.dumps(self.players, indent=4))
                    await self.split_into_groups()
                    print(json.dumps(self.players, indent=4))
                    print(json.dumps(self.group1, indent=4))
                    print(json.dumps(self.group2, indent=4))
                    self.countdown_task = asyncio.create_task(self.split_game())

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
        if self.channel_name in self.group1:
            player_name = self.group1[self.channel_name]
            del self.group1[self.channel_name]
        if self.channel_name in self.group2:
            player_name = self.group2[self.channel_name]
            del self.group2[self.channel_name]
        if self.channel_name in self.final:
            player_name = self.final[self.channel_name]
            del self.final[self.channel_name]
        print(f"Player {player_name} disconnected")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # game logic

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'paddle_move':
            await self.move_paddle(data['key'])

    async def move_paddle(self, key):
        user = self.scope['user']
        if self.channel_name in self.group1:
            paddle = 'paddle1' if user.username == list(self.group1.values())[0] else 'paddle2'
            if key == 'ArrowUp' and self.game_state_group1[paddle] > 0:
                self.game_state_group1[paddle] -= 10
            elif key == 'ArrowDown' and self.game_state_group1[paddle] < 300:
                self.game_state_group1[paddle] += 10
        else:
            paddle = 'paddle1' if user.username == list(self.group2.values())[0] else 'paddle2'
            if key == 'ArrowUp' and self.game_state_group2[paddle] > 0:
                self.game_state_group2[paddle] -= 10
            elif key == 'ArrowDown' and self.game_state_group2[paddle] < 300:
                self.game_state_group2[paddle] += 10

    async def split_game(self):
        group1_task = asyncio.create_task(self.start_game_countdown("group1"))
        group2_task = asyncio.create_task(self.start_game_countdown("group2"))
        # await group1_task
        # await group2_task
        await asyncio.gather(group1_task, group2_task)
        # batch = asyncio.gather(self.start_game_countdown("group1"), self.start_game_countdown("group2"), return_exceptions=True)
        # group1_task, group2_task = await batch
        print(json.dumps(self.final, indent=4))
        print(json.dumps(self.looser, indent=4))
        # self.game_loop_task = {}
        print("Games finished")

    async def start_game_countdown(self, group_name):
        print(group_name)
        user = self.scope['user']
        if group_name == 'group1':
            if user.username == list(self.group1.values())[0]:
                first = list(self.group1.values())[0]
                oponent = list(self.group1.values())[1]
            else:
                first = list(self.group1.values())[1]
                oponent = list(self.group1.values())[0]
        else:
            if user.username == list(self.group2.values())[0]:
                first = list(self.group2.values())[0]
                oponent = list(self.group2.values())[1]
            else:
                first = list(self.group2.values())[1]
                oponent = list(self.group2.values())[0]
        print(oponent)
        await self.channel_layer.group_send(
            group_name,
            {
                'type': 'both_players_joined',
                'name1': first,
                'name': oponent
            }
        )
        await asyncio.sleep(2)
        for i in range(5, 0, -1):
            await self.channel_layer.group_send(
                group_name,
                {
                    'type': 'countdown',
                    'message': f"Game starts in {i} seconds..."
                }
            )
            await asyncio.sleep(1)
        await self.channel_layer.group_send(
            group_name,
            {
                'type': 'game_started'
            }
        )
        if group_name == 'group1':
            self.game_loop_group1 = asyncio.create_task(self.game_loop(group_name))
            # await self.task1
            await self.game_loop_group1
        else:
            self.game_loop_group2 = asyncio.create_task(self.game_loop(group_name))
            # await self.task2
            await self.game_loop_group2
        # await asyncio.gather(*self.tasks)
        # self.reset_game(group_name)

    async def game_loop(self, group_name):
        if group_name == 'group1':
            while len(self.group1) == 2:
                self.update_game_state_group1()
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'game_state_update',
                        'game_state': self.game_state_group1
                    }
                )
                await asyncio.sleep(0.033)  # frame per second refresh rate
        else:
            while len(self.group2) == 2:
                self.update_game_state_group2()
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'game_state_update',
                        'game_state': self.game_state_group2
                    }
                )
                await asyncio.sleep(0.033)  # frame per second refresh rate

    def update_game_state_group1(self):
        self.game_state_group1['ball']['x'] += self.game_state_group1['ball']['dx']
        self.game_state_group1['ball']['y'] += self.game_state_group1['ball']['dy']

        if self.game_state_group1['ball']['y'] <= 0 or self.game_state_group1['ball']['y'] >= 380:
            self.game_state_group1['ball']['dy'] *= -1

        if (self.game_state_group1['ball']['x'] <= 20 and
            self.game_state_group1['paddle1'] <= self.game_state_group1['ball']['y'] <= self.game_state_group1['paddle1'] + 80):
            self.game_state_group1['ball']['dx'] *= -1
        elif (self.game_state_group1['ball']['x'] >= 760 and
              self.game_state_group1['paddle2'] <= self.game_state_group1['ball']['y'] <= self.game_state_group1['paddle2'] + 80):
            self.game_state_group1['ball']['dx'] *= -1

        if self.game_state_group1['ball']['x'] <= 0:
            self.game_state_group1['score']['player2'] += 1
            self.reset_ball('group1')
        elif self.game_state_group1['ball']['x'] >= 780:
            self.game_state_group1['score']['player1'] += 1
            self.reset_ball('group1')

        if self.game_state_group1['score']['player1'] >= 3 or self.game_state_group1['score']['player2'] >= 3:
            winner = list(self.group1.values())[0] if self.game_state_group1['score']['player1'] >= 3 else list(self.group1.values())[1]
            if self.game_state_group1['score']['player1'] >= 3:
                self.final[list(self.group1.keys())[0]] = list(self.group1.values())[0]
                self.looser[list(self.group1.keys())[1]] = list(self.group1.values())[1]
            else:
                self.final[list(self.group1.keys())[1]] = list(self.group1.values())[1]
                self.looser[list(self.group1.keys())[0]] = list(self.group1.values())[0]
            result = {
                'players': list(self.group1.values()),
                'winner': winner,
                'score': self.game_state_group1['score']
            }
            # task1 = asyncio.create_task(self.channel_layer.group_send(
            #     'group1',
            #     {
            #         'type': 'game_over',
            #         'winner': winner
            #     }
            # ))
            # self.tasks.append(task1)
            self.task2 = asyncio.create_task(self.send_game_result(result, 'group1'))
            self.reset_game('group1')

    def update_game_state_group2(self):
        self.game_state_group2['ball']['x'] += self.game_state_group2['ball']['dx']
        self.game_state_group2['ball']['y'] += self.game_state_group2['ball']['dy']

        if self.game_state_group2['ball']['y'] <= 0 or self.game_state_group2['ball']['y'] >= 380:
            self.game_state_group2['ball']['dy'] *= -1

        if (self.game_state_group2['ball']['x'] <= 20 and
            self.game_state_group2['paddle1'] <= self.game_state_group2['ball']['y'] <= self.game_state_group2['paddle1'] + 80):
            self.game_state_group2['ball']['dx'] *= -1
        elif (self.game_state_group2['ball']['x'] >= 760 and
              self.game_state_group2['paddle2'] <= self.game_state_group2['ball']['y'] <= self.game_state_group2['paddle2'] + 80):
            self.game_state_group2['ball']['dx'] *= -1

        if self.game_state_group2['ball']['x'] <= 0:
            self.game_state_group2['score']['player2'] += 1
            self.reset_ball('group2')
        elif self.game_state_group2['ball']['x'] >= 780:
            self.game_state_group2['score']['player1'] += 1
            self.reset_ball('group2')

        if self.game_state_group2['score']['player1'] >= 3 or self.game_state_group2['score']['player2'] >= 3:
            winner = list(self.group2.values())[0] if self.game_state_group2['score']['player1'] >= 3 else list(self.group2.values())[1]
            if self.game_state_group2['score']['player1'] >= 3:
                self.final[list(self.group2.keys())[0]] = list(self.group2.values())[0]
                self.looser[list(self.group2.keys())[1]] = list(self.group2.values())[1]
            else:
                self.final[list(self.group2.keys())[1]] = list(self.group2.values())[1]
                self.looser[list(self.group2.keys())[1]] = list(self.group2.values())[1]
            result = {
                'players': list(self.group2.values()),
                'winner': winner,
                'score': self.game_state_group2['score']
            }
            # task1 = asyncio.create_task(self.channel_layer.group_send(
            #     'group2',
            #     {
            #         'type': 'game_over',
            #         'winner': winner
            #     }
            # ))
            # self.tasks.append(task1)
            task2 = asyncio.create_task(self.send_game_result(result, 'group2'))
            self.reset_game('group2')


    def reset_ball(self, group_name):
        if group_name == 'group1':
            self.game_state_group1['ball']['x'] = 390
            self.game_state_group1['ball']['y'] = 190
            self.game_state_group1['ball']['dx'] = random.choice([-5, 5])
            self.game_state_group1['ball']['dy'] = random.choice([-5, 5])
        else:
            self.game_state_group2['ball']['x'] = 390
            self.game_state_group2['ball']['y'] = 190
            self.game_state_group2['ball']['dx'] = random.choice([-5, 5])
            self.game_state_group2['ball']['dy'] = random.choice([-5, 5])

    def reset_game(self, group_name):
        if group_name == 'group1':
            self.game_state_group1 = {
                'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
                'paddle1': 160,
                'paddle2': 160,
                'score': {'player1': 0, 'player2': 0}
            }
        else:
            self.game_state_group2 = {
                'ball': {'x': 390, 'y': 190, 'dx': 5, 'dy': 5},
                'paddle1': 160,
                'paddle2': 160,
                'score': {'player1': 0, 'player2': 0}
            }
        # if self.game_loop_task[group_name]:
        #     self.game_loop_task[group_name].cancel()

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
            'name': event['name'],
            'name1': event['name1']
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
        # await self.close()

    async def game_started(self, event):
        await self.send(text_data=json.dumps({
            'type': 'game_started',
            'message': 'Game started!'
        }))

    async def send_game_result(self, result, group_name):
        user = self.scope['user']
        opponent_username = result['players'][1] if user.username == result['players'][0] else result['players'][0]

        if result['winner'] == user.username:
            winner = user.username
            looser = opponent_username
        else:
            winner = opponent_username
            looser = user.username

        asyncio.create_task(self.channel_layer.group_send(
                group_name,
                {
                    'type': 'game_over',
                    'winner': 'Charlie'
                }
            ))
        print(f"Game result: {result}")

    async def split_into_groups(self):
        self.group1[list(self.players.keys())[0]] = list(self.players.values())[0]
        self.group1[list(self.players.keys())[1]] = list(self.players.values())[1]
        self.group2[list(self.players.keys())[2]] = list(self.players.values())[2]
        self.group2[list(self.players.keys())[3]] = list(self.players.values())[3]
        for channels in self.group1.keys():
            await self.channel_layer.group_discard('lobby', channels)
            await self.channel_layer.group_add('group1', channels)
            if self.channel_name == channels:
                self.group_name = 'group1'
        for channels in self.group2.keys():
            await self.channel_layer.group_discard('lobby', channels)
            await self.channel_layer.group_add('group2', channels)
            if self.channel_name == channels:
                self.group_name = 'group2'
        # self.players = {}


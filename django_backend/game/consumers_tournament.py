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

class TournamentConsumer(AsyncWebsocketConsumer):
    tournament_sessions = {}
    disconnected_players = {}
    rejoin_timeout = 10  # should be changed to a better amount



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
                    self.session_id = session_id
                    self.add_player_to_session(session_id, user.username, self.channel_name)
                    await self.channel_layer.group_add(session_id, self.channel_name)
                    await self.channel_layer.group_send(
                        session_id,
                        {
                            'type': 'player_rejoined',
                            'name': user.username,
                            # 'opponent': self.disconnected_players[user.username]['opponent']
                        }
                    )
                    # delete the player from disconnected, and resume game loop if both players are back
                    del self.disconnected_players[user.username]
                    print(f"Player {user.username} rejoined session {session_id}")
                    # if len(self.tournament_sessions[session_id]['players']) == 4:
                    #     # To Do
                    #     self.resume_game(session_id)
                    return
                else:
                    del self.disconnected_players[user.username]
                    print(f"Rejoin deadline expired for player {user.username}")
                    return

            session_id = self.get_available_session() # handle new user connection
            if session_id and self.tournament_sessions[session_id]['semifinals_started'] == False:
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
                if len(self.tournament_sessions[session_id]['players']) == 4:
                    # To Do
                    await self.channel_layer.group_send(
                        session_id,
                        {
                            'type': 'ready',
                            'message': 'Tournament is about to start! Group selection process starts now ...'
                        }
                    )
                    self.grouping_semifinals(session_id)
                    await self.channel_layer.group_send(
                        session_id,
                        {
                            'type': 'semifinals_matchmaking',
                            'group1_name1': list(self.tournament_sessions[session_id]['group1']['players'].values())[0],
                            'group1_name2': list(self.tournament_sessions[session_id]['group1']['players'].values())[1],
                            'group2_name1': list(self.tournament_sessions[session_id]['group2']['players'].values())[0],
                            'group2_name2': list(self.tournament_sessions[session_id]['group2']['players'].values())[1],
                        }
                    )
                    if self.channel_name in self.tournament_sessions[session_id]['group1']['players']:
                        await self.channel_layer.group_add(self.tournament_sessions[session_id]['group1']['session_id'], self.channel_name)
                    else:
                        await self.channel_layer.group_add(self.tournament_sessions[session_id]['group2']['session_id'], self.channel_name)
                    # self.countdown_task = asyncio.create_task(self.start_game_countdown(session_id))
            # elif session_id and self.tournament_sessions[session_id]['semifinals_started'] == True:
                # ToDo
            else:
                await self.close()
                print("Connection closed: no available game session")
        else:
            await self.close()
            print("Connection closed for unauthenticated user")


    # on disconnect, the method checks if the user was part of a game session, and if yes, then it removes the user from the game session
    # it also adds the user to a list of disconnected players, with a deadline for rejoining the game session
    # if the user does not rejoin within the deadline, the remaining player in the game session is declared the winner
    # the game session is then closed

    async def disconnect(self, close_code):
        if hasattr(self, 'session_id') and self.session_id in self.tournament_sessions:
            if self.tournament_sessions[self.session_id]['semifinals_started'] == False:
                player_name = self.tournament_sessions[self.session_id]['players'].pop(self.channel_name, None)
                other_players = list(self.tournament_sessions[self.session_id]['players'].values())
                if player_name:
                    self.disconnected_players[player_name] = {
                        'session_id': self.session_id,
                        'rejoin_deadline': time.time() + self.rejoin_timeout,
                        'players': other_players
                    }
                    await self.channel_layer.group_discard(self.session_id, self.channel_name)
                    print(f"Player {player_name} disconnected from session {self.session_id}")
                    if 'game_loop_task' in self.tournament_sessions[self.session_id]:
                        self.tournament_sessions[self.session_id]['game_loop_task'].cancel()
                        self.tournament_sessions[self.session_id]['game_loop_task'] = None
                    asyncio.create_task(self.check_player_rejoin_timeout(self.session_id, player_name, other_players))



    # 														***	session management ***

    # a game session is a dictionary that contains the players in the session, the game state, and the game loop task
    # method checks for available game sessions, if none are available, it creates a new game session.
    # the other method adds the player to the game session

    def get_available_session(self):
        user = self.scope['user']
        for session_id, session in self.tournament_sessions.items():
            if user.username in session['players'].keys():
                return session_id
        for session_id, session in self.tournament_sessions.items():
            if len(session['players']) < 4:
                return session_id
        #new_session_id = f"game_session_{len(self.tournament_sessions) + 1}"
        new_session_id = f"game_session_{uuid.uuid4()}"
        self.tournament_sessions[new_session_id] = {
            'players': {},
            'group1': {
                'players': {},
                'session_id': f"group1_session_{uuid.uuid4()}",
            },
            'group2': {
                'players': {},
                'session_id': f"group2_session_{uuid.uuid4()}",
            },
            'semifinals_started': False,
            'finals': {
                'players': {},
                'session_id': f"finals_session_{uuid.uuid4()}",
            },
            'finals_started': False,
            'game_loop_task': None
        }
        return new_session_id

    def add_player_to_session(self, session_id, username, channel_name):
        self.tournament_sessions[session_id]['players'][channel_name] = username

    def resume_game(self, session_id):
        if 'game_loop_task' not in self.tournament_sessions[session_id] or self.tournament_sessions[session_id]['game_loop_task'] is None:
            self.tournament_sessions[session_id]['game_loop_task'] = asyncio.create_task(self.game_loop(session_id))

    # check if the player has reconnected within the timeout period and it's name is deleted from disconnected players, and if not, declare the remaining player as the winner
    # and close the game session

    async def check_player_rejoin_timeout(self, session_id, disconnected_player, other_players):
        if 0 < len(self.tournament_sessions[session_id]['players']) < 4:
            await self.channel_layer.group_send(
                self.session_id,
                {
                    'type': 'tournament_pause',
                    'message': 'wait for player to rejoin...'
                }
            )
        await asyncio.sleep(self.rejoin_timeout)
        if disconnected_player in self.disconnected_players and self.disconnected_players[disconnected_player]['session_id'] == session_id:
            del self.disconnected_players[disconnected_player]
            if other_players:
                await self.channel_layer.group_send(
                    session_id,
                    {
                        'type': 'tournament_cancelation',
                        'name': disconnected_player,
                        'message': ' did not rejoin in time. Tournament is cancelled.'
                    }
                )
                print(f"Player {disconnected_player} did not rejoin in time. Tournament is cancelled.")
                await self.close_game_session(session_id, other_players)

    async def close_game_session(self, session_id, other_players):
            game_session = self.tournament_sessions.pop(session_id, None)
            if game_session:
                for player_channel in game_session['players'].keys():
                    await self.channel_layer.group_discard(session_id, player_channel)
                for player_channel in game_session['group1']['players'].keys():
                    await self.channel_layer.group_discard(game_session['group1']['session_id'], player_channel)
                for player_channel in game_session['group2']['players'].keys():
                    await self.channel_layer.group_discard(game_session['group2']['session_id'], player_channel)
                # result = {
                #     'players': list(game_session['players'].values()),
                #     'winner': winner,
                #     'score': game_session['game_state']['score']
                # }
                # await self.send_game_result(result, session_id, winner)
                print(f"Tournament session {session_id} closed.")



    # 															***	matchmaking ***

    # method sends messages to the clients to start the game countdown. It then sends messages to the clients to update the game state
    # the game loop method updates the game state and sends the updated game state to the clients. the game loop runs until the game is over
    # the update game state method updates the position of the ball, checks for collisions, updates the score, and checks for a winner

    def grouping_semifinals(self, session_id):
        players = list(self.tournament_sessions[session_id]['players'].items())
        group1_players = players[:2]
        group2_players = players[2:]

        for channel_name, username in group1_players:
            self.tournament_sessions[session_id]['group1']['players'][channel_name] = username

        for channel_name, username in group2_players:
            self.tournament_sessions[session_id]['group2']['players'][channel_name] = username


    # 															***	message handling ***

    # receive data from channels and send messages to the clients. the messages are sent to the channel layer, which then sends them to the clients
    # each message type has a corresponding method that sends the message to the clients, and the client will handle the message accordingly

    async def player_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player_joined',
            'name': event['name']
        }))

    async def player_rejoined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player_rejoined',
            'name': event['name'],
            # 'opponent': event['opponent']
        }))

    async def tournament_cancelation(self, event):
        await self.send(text_data=json.dumps({
            'type': 'tournament_cancelation',
            'name': event['name'],
            'message': event['message']
        }))
        await asyncio.sleep(2)
        await self.close(code=4001)

    async def tournament_pause(self, event):
        await self.send(text_data=json.dumps({
            'type': 'tournament_pause',
            'message': event['message']
        }))



    # 															***	game result ***

    # method sends the game result to the clients, through accessing the profile model and updating the player's stats, also creates a history string
    # which is being parsed inside the model to update the player's game history. @sync_to_async is used to make the database queries asynchronous
    # the method then sends a message to the clients to inform them of the game result, that is being shown on the page at the end of the game






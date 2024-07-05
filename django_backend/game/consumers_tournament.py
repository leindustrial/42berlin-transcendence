import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random

class TournamentConsumer(AsyncWebsocketConsumer):
    players = {}

    async def connect(self):
        await self.accept()
        user = self.scope['user']
        if user.is_authenticated:
            if len(self.players) < 4:
                self.players[self.channel_name] = user.username
                await self.channel_layer.group_add('pong_game', self.channel_name)
                await self.channel_layer.group_send(
                    'pong_game',
                    {
                        'type': 'player_joined',
                        'name': user.username
                    }
                )

    async def player_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player_joined',
            'name': event['name']
        }))

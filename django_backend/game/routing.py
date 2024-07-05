from django.urls import path
from . import consumers, consumers_tournament

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('ws/pong/', consumers.PongConsumer.as_asgi()),
    path('ws/tournament/', consumers_tournament.TournamentConsumer.as_asgi()),
]

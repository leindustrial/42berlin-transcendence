from django.urls import path, re_path
from . import consumers, consumers_tournament

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('ws/pong/', consumers.PongConsumer.as_asgi()),
    re_path(r'ws/tournament/(?P<display_name>\w+)/$', consumers_tournament.TournamentConsumer.as_asgi()),
]

from django.urls import path, re_path
from . import consumers_4pl
from . import consumers_2pl
from . import consumers_tournament

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('ws/pong/', consumers_2pl.PongConsumer.as_asgi()),
	path('ws/4pong/', consumers_4pl.PongConsumer.as_asgi()),
    re_path(r'ws/tournament/(?P<display_name>\w+)/$', consumers_tournament.TournamentConsumer.as_asgi()),
]

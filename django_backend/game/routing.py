from django.urls import path, re_path
from . import consumers_4pl
from . import consumers_2pl
from . import tour_consumer
from . import consumers_tourgame

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('wss/pong/', consumers_2pl.PongConsumer.as_asgi()),
	path('wss/4pong/', consumers_4pl.PongConsumer.as_asgi()),
    path('wss/tournament/', tour_consumer.TournamentConsumer.as_asgi()),
    re_path(r'tour_game/(?P<session_id>[0-9a-fA-F-]+)/$', consumers_tourgame.PongConsumer.as_asgi()),
]

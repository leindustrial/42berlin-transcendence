from django.urls import path
from . import consumers_4pl
from . import consumers_2pl

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('wss/pong/', consumers_2pl.PongConsumer.as_asgi()),
	path('wss/4pong/', consumers_4pl.PongConsumer.as_asgi())
]

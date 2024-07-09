from django.urls import path
from . import consumers_4pl
from . import consumers_2pl

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('ws/pong/', consumers_2pl.PongConsumer.as_asgi()),
	path('ws/4pong/', consumers_4pl.PongConsumer.as_asgi())
]

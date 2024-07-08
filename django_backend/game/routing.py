from django.urls import path
from . import consumers_test
from . import consumers_4player
from . import consumers_new

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('ws/pong/', consumers_test.PongConsumer.as_asgi()),
	path('ws/4pong/', consumers_4player.PongConsumer.as_asgi())
]

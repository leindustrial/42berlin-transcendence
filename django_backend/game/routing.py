from django.urls import path
from . import consumers

# equivalent to the url patterns in the urls.py file for websockets
websocket_urlpatterns = [
    path('ws/pong/', consumers.PongConsumer.as_asgi()),
]

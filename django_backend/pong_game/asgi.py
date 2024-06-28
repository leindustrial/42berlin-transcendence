"""
ASGI config for pong_game project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""
# This is the entry point for the ASGI application. It is responsible for routing the incoming requests to the appropriate consumer.
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import game.routing 

# specifies which settings file Django should use for configuration
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong_game.settings')

# routes different types of connection protocols to the appropriate handling mechanism. get_asgi_application() is a function that loads the Django ASGI application.
application = ProtocolTypeRouter({ 
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
})
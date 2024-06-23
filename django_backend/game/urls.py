from django.urls import path
from . import views

urlpatterns = [
	path('', views.game_start, name='game_start'),
]
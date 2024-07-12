from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),  # Include i18n URL for language setting
	path('', views.hello, name='hello'),
    path('game-start/', views.game_start, name='game_start'),
    path('two-pl-game/', views.two_pl_game, name='two_pl_game'),
    path('four-pl-game/', views.four_pl_game, name='four_pl_game'),
    path('offline-game/', views.offline_game, name='offline_game'),
    path('tournament/<str:display_name>/', views.tournament, name='tournament'),
]

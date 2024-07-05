from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),  # Include i18n URL for language setting
	path('', views.game_start, name='game_start'),
    path('choose-mode/', views.choose_mode, name='choose_mode'),
    path('two-pl-game/', views.two_pl_game, name='two_pl_game'),
    path('four-pl-game/', views.four_pl_game, name='four_pl_game'),
    path('tournament/', views.tournament, name='tournament'),
]

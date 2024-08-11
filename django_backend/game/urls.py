from . import views
from django.urls import path, include, re_path

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),  # Include i18n URL for language setting

	path('', views.get_started, name='get-started'),
    path('api/get-username/', views.get_username, name='get-username'),
    # path('game-start/', views.game_start, name='game_start'),
    # path('two-pl-game/', views.two_pl_game, name='two_pl_game'),
    # path('four-pl-game/', views.four_pl_game, name='four_pl_game'),
    # path('offline-game/', views.offline_game, name='offline_game'),
    # path('offline-tour/', views.offline_tour, name='offline_tour'),
    # path('tournament/', views.tournament, name='tournament'),
    # re_path(r'tour_game/(?P<session_id>[0-9a-fA-F-]+)/$', views.tour_game, name='tour_game'),
]

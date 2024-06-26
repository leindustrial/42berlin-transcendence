from django.urls import path
from . import views
from django.urls import path, include

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),  # Include i18n URL for language setting
	path('', views.game_start, name='game_start'),
]
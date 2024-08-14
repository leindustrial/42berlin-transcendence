from . import views
from django.urls import path, include, re_path

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),  # Include i18n URL for language setting
	path('', views.get_started, name='get-started'),
    path('api/get-username/', views.get_username, name='get-username'),
]

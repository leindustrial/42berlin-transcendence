"""
URL configuration for pong_game project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from game import views
from django.conf.urls.i18n import i18n_patterns
from django.urls import include, re_path
from django.views.static import serve




urlpatterns = [
    path('set-language/', views.set_language, name='set_language'),
    path('admin/', admin.site.urls),
    path('', include('django_prometheus.urls')),
]

urlpatterns += i18n_patterns(
    path('', include('game.urls')),  # Include game app URLs with language prefix
    path('game-start/users/', include('django.contrib.auth.urls')),  # Include auth URLs with language prefix
    path('game-start/users/', include('users.urls')),  # Include additional user-related URLs with language prefix
	re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
)

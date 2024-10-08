from django.urls import path
from . import views
from django.utils.translation import gettext_lazy as _

urlpatterns = [
	path('json_signup/', views.json_signup, name='json_signup'),
	path('json_login/', views.json_login, name='json_login'),
	path('json_logout/', views.json_logout, name='json_logout'),
	path('json_profile/', views.json_profile, name='json_profile'),
	path('json_profile_list/', views.json_profile_list, name='json_profile_list'),
	path('json_profile/<int:pk>', views.json_profile_pk, name='json_profile_pk'),
	path('json_update_user/', views.json_update_user, name='json_update_user'),
	path('json_update_display_name/', views.json_update_display_name, name='json_update_display_name'),
	path('json_update_avatar', views.json_update_avatar, name='json_update_avatar'),
]


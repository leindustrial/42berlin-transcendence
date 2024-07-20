from django.urls import path
from . import views
from django.utils.translation import gettext_lazy as _

urlpatterns = [
	path('signup/', views.signup, name='signup'),
	path('logout/', views.logout, name='logout'),
	path('profiles_list/<int:pk>', views.profiles_list, name='profiles_list'),
	path('profile/<int:pk>', views.profile, name='profile'),
	path('json_profile/', views.json_profile, name='json_profile'),
	path('json_profile_list', views.json_profile_list, name='json_profile_list'),
	path('update_user/', views.update_user, name='update_user'),
	path('update_display_name/', views.update_display_name, name='update_display_name'),
	path('update_avatar', views.update_avatar, name='update_avatar'),
]

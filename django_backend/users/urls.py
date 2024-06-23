from django.urls import path
from . import views

urlpatterns = [
	path('signup/', views.signup, name='signup'),
	path('logout/', views.logout, name='logout'),
	path('profiles_list/<int:pk>', views.profiles_list, name='profiles_list'),
	path('profile/<int:pk>', views.profile, name='profile'),
	path('update_user/', views.update_user, name='update_user'),
	path('update_display_name/', views.update_display_name, name='update_display_name'),
]

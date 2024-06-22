from django.urls import path
from . import views

urlpatterns = [
	path('signup/', views.signup, name='signup'),
	path('logout/', views.logout, name='logout'),
	path('profiles_list/<int:pk>', views.profiles_list, name='profiles_list'),
	path('profile/<int:pk>', views.profile, name='profile'),
	path('update_profile/', views.update_profile, name='update_profile')
]

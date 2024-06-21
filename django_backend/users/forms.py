from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile
from django import forms

class RegisterUserForm(UserCreationForm):
	display_name = forms.CharField(max_length=12)
	avatar = forms.ImageField(required=False)

	class Meta:
		model = User
		fields = ['username', 'display_name', 'avatar', 'password1', 'password2']

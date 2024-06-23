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

class UpdateDisplayNameForm(forms.ModelForm):
	display_name = forms.CharField(max_length=12)

	class Meta:
		model = Profile
		fields = ['display_name']

class UpdateAvatarForm(forms.ModelForm):
	avatar = forms.ImageField(label="Profile Picture")

	class Meta:
		model = Profile
		fields = ['avatar']

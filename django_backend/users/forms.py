from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile
from django import forms

class UpdateDisplayNameForm(forms.ModelForm):
	display_name = forms.CharField(max_length=12)

	class Meta:
		model = Profile
		fields = ['display_name']

class UpdateAvatarForm(forms.ModelForm):
	class Meta:
		model = Profile
		fields = ['avatar']


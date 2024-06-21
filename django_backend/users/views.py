from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from .forms import RegisterUserForm
from .models import Profile
from django.contrib.auth.models import User

# Create your views here.
def signup(request):
	if request.method == "POST":
		form = RegisterUserForm(request.POST)
		if form.is_valid():
			# form.save()
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password1')
			display_name = form.cleaned_data.get('display_name')
			avatar = form.cleaned_data.get('avatar')
			user = User.objects.create_user(username=username, password=password)
			user.save()
			profile = Profile.objects.create(user=user, display_name=display_name, avatar=avatar)
			profile.save()
			user = authenticate(username=username, password=password)
			login(request, user)
			messages.success(request, ("Registration successfull"))
			return redirect('/')
	else:
		form = RegisterUserForm()
	return render(request, 'registration/signup.html', {'form':form,})

def logout(request):
	if request.method == "POST":
		logout(request)
		return redirect('/')

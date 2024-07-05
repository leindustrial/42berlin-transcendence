from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from .forms import UpdateDisplayNameForm, UpdateAvatarForm
from .models import Profile
from django.contrib.auth.models import User
import os

# Create your views here.
def signup(request):
	if request.method == "POST":
		form = UserCreationForm(request.POST)
		if form.is_valid():
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password1')
			user = User.objects.create_user(username=username, password=password)
			profile = Profile.objects.create(user=user)
			user = authenticate(username=username, password=password)
			login(request, user)
			return redirect('/')
	else:
		form = UserCreationForm()
	return render(request, 'registration/signup.html', {'form':form,})

def logout(request):
	if request.method == "POST":
		logout(request)
		return redirect('/')

def profile(request, pk):
	if request.user.is_authenticated:
		profile = Profile.objects.get(user_id=pk)
		match_history = profile.match_history
		if match_history is None:
			match_history = ""
		match_history = match_history.split(';')
		table_data = []
		for match in match_history:
			row = match.split(',')
			row = [item.strip() for item in row]
			table_data.append(row)
		total_games = profile.wins + profile.losses
		return render(request, 'users/profile.html', {'profile':profile, 'total_games':total_games, 'table_data':table_data})
	else:
		return redirect('/')

def profiles_list(request, pk):
	if request.user.is_authenticated:
		profiles = Profile.objects.exclude(user=request.user)
		current_user = Profile.objects.get(user_id=pk)
		if request.method == "POST":
			action = request.POST['action']
			user_id = request.POST['user_id']
			target = Profile.objects.get(user_id=user_id)
			if action == "unfriend":
				current_user.friends.remove(target)
			else:
				current_user.friends.add(target)
			current_user.save()

		return render(request, 'users/profiles_list.html', {'profiles':profiles, 'current_user':current_user,})
	else:
		return redirect('/')

def update_user(request):
	if request.user.is_authenticated:
		current_user = User.objects.get(id=request.user.id)
		current_profile = Profile.objects.get(user_id=request.user.id)
		form = UserCreationForm(request.POST or None, instance=current_user)
		if form.is_valid():
			form.save()
			login(request, current_user)
			return redirect('/')
		return render(request, 'users/update_user.html', {'form':form,})
	else:
		return redirect('/')

def update_display_name(request):
	if request.user.is_authenticated:
		current_user = User.objects.get(id=request.user.id)
		current_profile = Profile.objects.get(user_id=request.user.id)
		form = UpdateDisplayNameForm(request.POST or None, instance=current_profile)
		if form.is_valid():
			# add error check for display name not unique
			form.save()
			login(request, current_user)
			return redirect('/')
		return render(request, 'users/update_display_name.html', {'form':form,})
	else:
		return redirect('/')

def update_avatar(request):
	if request.user.is_authenticated:
		current_user = User.objects.get(id=request.user.id)
		current_profile = Profile.objects.get(user_id=request.user.id)
		old_avatar = current_profile.avatar
		form = UpdateAvatarForm(request.POST or None, request.FILES or None, instance=current_profile)
		if form.is_valid():
			form.save()
			if old_avatar:
				os.remove(old_avatar.path)
			login(request, current_user)
			return redirect('/')
		return render(request, 'users/update_avatar.html', {'form':form,})
	else:
		return redirect('/')

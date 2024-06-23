from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from .forms import RegisterUserForm, UpdateDisplayNameForm
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
			#user.save()
			profile = Profile.objects.create(user=user, display_name=display_name, avatar=avatar)
			# profile.friends.clear()
			# profile.save()
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

def profile(request, pk):
	if request.user.is_authenticated:
		profile = Profile.objects.get(user_id=pk)
		return render(request, 'users/profile.html', {'profile':profile,})
	else:
		return redirect('/')

def profiles_list(request, pk):
	if request.user.is_authenticated:
		profiles = Profile.objects.exclude(user=request.user)
		current_user = Profile.objects.get(user_id=pk)

		# Post Form logic for Unfriend / Befriend
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
			form.save()
			login(request, current_user)
			return redirect('/')
		return render(request, 'users/update_display_name.html', {'form':form,})
	else:
		return redirect('/')

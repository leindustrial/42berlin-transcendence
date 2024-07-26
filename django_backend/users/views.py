from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from .forms import UpdateDisplayNameForm, UpdateAvatarForm
from .models import Profile
from django.contrib.auth.models import User
import os
from django.utils.translation import gettext_lazy as _
from django.http import JsonResponse, HttpResponse
from django.middleware.csrf import get_token

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

def json_signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = User.objects.create_user(username=username, password=password)
            profile = Profile.objects.create(user=user)
            user = authenticate(username=username, password=password)
            login(request, user)
            data = 'User' + username + 'created succesfully'
            return JsonResponse({'msg': data, 'status': 'success', 'csrf_token': get_token(request)})
        else:
            return HttpResponse('There was an error with your form')

def json_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(username)
        user = authenticate(request, username=username, password=password)
        print(f"Authenticated user: {user}")
        if user is not None:
            login(request, user)
            return JsonResponse({'msg':'You are now logged in', 'status': 'success', 'csrf_token': get_token(request)})
        else:
            return JsonResponse({'error': 'Please check your username and password are correct'}, status=404)
    else:
        return JsonResponse({'error': 'Not a valid request'}, status=405)

def json_logout(request):
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({'msg':'You are now logged out', 'status': 'success', 'csrf_token': get_token(request)})
    else:
        return HttpResponse('You need to log in first')


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

def json_profile_pk(request, pk):
    if request.method == 'GET':
        if request.user.is_authenticated:
            profile = Profile.objects.get(user_id=pk)
            if profile.avatar:
                profile_pic_url = profile.avatar.url
            else:
                profile_pic_url = None
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
            # manual Serialization
            data = {
                'userid': pk,
                'username': profile.user.username,
                'display_name': profile.display_name,
                'avatar': profile_pic_url,
                'wins': profile.wins,
                'losses': profile.losses,
                'total_games': total_games,
                'friends': [
                    {
                        'username': friend.user.username,
                        'id': friend.user.id,
                        'online_status': friend.online_status
                    } for friend in profile.friends.all()
                ],
                'match_history': table_data,
                'status': 'success'
            }
            return JsonResponse(data)
        else:
            return JsonResponse({'error': 'You need to log in first'}, status=403)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



def json_profile(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            profile = Profile.objects.get(user_id=request.user.id)
            if profile.avatar:
                profile_pic_url = profile.avatar.url
            else:
                profile_pic_url = None
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
            # manual Serialization
            data = {
                'userid': request.user.id,
                'username': profile.user.username,
                'display_name': profile.display_name,
                'avatar': profile_pic_url,
                'wins': profile.wins,
                'losses': profile.losses,
                'total_games': total_games,
                'friends': [
                    {
                        'username': friend.user.username,
                        'id': friend.user.id,
                        'online_status': friend.online_status
                    } for friend in profile.friends.all()
                ],
                'match_history': table_data,
                'status': 'success'
            }
            return JsonResponse(data)
        else:
            return JsonResponse({'error': 'You need to log in first'}, status=403)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

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

def json_profile_list(request):
    if request.user.is_authenticated:
        if request.method == 'GET':
            profiles = Profile.objects.exclude(user=request.user)
            current_user = Profile.objects.get(user_id=request.user.id)
            friend_ids = set(current_user.friends.values_list('user_id', flat=True))
            data = {
                'profiles': [
                    {
                        'username': profile.user.username,
                        'id': profile.user.id,
                        # shall be based on
                        # if profile in current_user.friends.all
                        'is_friend': profile.user.id in friend_ids,
                    } for profile in profiles
                ],
                'status': 'success',
            }
            return JsonResponse(data)
        elif request.method == 'POST':
            current_user = Profile.objects.get(user_id=request.user.id)
            action = request.POST.get('action')
            target_id = request.POST.get('user_id')
            all_profile_ids = set(Profile.objects.values_list('user_id', flat=True))
            if int(target_id) in all_profile_ids:
                target = Profile.objects.get(user_id=target_id)
                if action == "unfriend":
                    if target in current_user.friends.all():
                        current_user.friends.remove(target)
                else:
                    if target not in current_user.friends.all():
                        current_user.friends.add(target)
                current_user.save()
                profiles = Profile.objects.exclude(user=request.user)
                friend_ids = set(current_user.friends.values_list('user_id', flat=True))
                data = {
                    'profiles': [
                        {
                            'username': profile.user.username,
                            'id': profile.user.id,
                            # shall be based on
                            # if profile in current_user.friends.all
                            'is_friend': profile.user.id in friend_ids,
                        } for profile in profiles
                    ],
                    'status': 'success',
                    # 'csrf_token': get_token(request)
                }
                return JsonResponse(data)
            else:
                return JsonResponse({'error': 'Not an existing profile id'}, status=404)
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)
    else:
        return JsonResponse({'error': 'You need to log in first'}, status=403)


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

def json_update_user(request):
    if request.user.is_authenticated:
        current_user = User.objects.get(id=request.user.id)
        current_profile = Profile.objects.get(user_id=request.user.id)
        form = UserCreationForm(request.POST or None, instance=current_user)
        if form.is_valid():
            form.save()
            login(request, current_user)
            return JsonResponse({'msg':'Your account has been updated', 'status': 'success', 'csrf_token': get_token(request)})
        return HttpResponse('An error occurred')
    else:
        return HttpResponse('You need to log in first')



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

def json_update_display_name(request):
    if request.user.is_authenticated:
        current_user = User.objects.get(id=request.user.id)
        current_profile = Profile.objects.get(user_id=request.user.id)
        form = UpdateDisplayNameForm(request.POST or None, instance=current_profile)
        if form.is_valid():
            display_name = form.cleaned_data.get('display_name')
            if Profile.objects.filter(display_name=display_name).exists():
                return HttpResponse('Display Name already exists')
            form.save()
            login(request, current_user)
            return JsonResponse({'msg':'Display Name has been updated', 'status': 'success', 'csrf_token': get_token(request)})
        return HttpResponse('An error occurred')
    else:
        return HttpResponse('You need to log in first')

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

def json_update_avatar(request):
    if request.user.is_authenticated:
        current_user = User.objects.get(id=request.user.id)
        current_profile = Profile.objects.get(user_id=request.user.id)
        old_avatar = current_profile.avatar
        print(old_avatar)
        if request.method == 'POST':
            form = UpdateAvatarForm(request.POST or None, request.FILES or None, instance=current_profile)
            if form.is_valid():
                avatar = form.cleaned_data.get('avatar')
                print(avatar)
                form.save()
                if old_avatar:
                    os.remove(old_avatar.path)
                login(request, current_user)
                return JsonResponse({'msg':'Profile pic has been updated', 'status': 'success', 'csrf_token': get_token(request)})
            return HttpResponse('Form not valid')
        else:
            return HttpResponse('Not a valid request')
    else:
        return HttpResponse('You need to log in first')


def profile_nav(request):
    return render(request, 'users/profile_nav.html')

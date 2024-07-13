from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _
from django.shortcuts import redirect
from django.utils.translation import activate
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from users.models import Profile

# Required for the language
def set_language(request):
    if request.method == 'POST':
        language = request.POST.get('language')
        if language:
            request.session[translation.LANGUAGE_SESSION_KEY] = language
            activate(language)

    next_url = request.POST.get('next') or '/'
    return redirect(next_url)


# Create your views here.

def hello(request):
    if request.user.is_authenticated:
        profile = Profile.objects.get(user_id=request.user.id)
    return render(request, 'game/hello.html', {'profile':profile,})

def offline_game(request):
    return render(request, 'game/offline-game.html')

@login_required
def game_start(request):
    profile = Profile.objects.get(user_id=request.user.id)
    return render(request, 'game/index.html', {'profile':profile,})

def two_pl_game(request):
    if request.user.is_authenticated:
        return render(request, 'game/two-pl-game.html')
    else:
        return redirect('/')

def four_pl_game(request):
    if request.user.is_authenticated:
        return render(request, 'game/four-pl-game.html')
    else:
        return redirect('/')

def tournament(request, display_name):
    if request.user.is_authenticated:
        return render(request, 'game/tournament.html')
        # return render(request, 'game/tournament.html', {'display_name':display_name,})
    else:
        return redirect('/')

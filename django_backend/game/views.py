from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _
from django.shortcuts import redirect
from django.utils.translation import activate
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

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
@login_required
def game_start(request):
	return render(request, 'game/index.html', {})

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
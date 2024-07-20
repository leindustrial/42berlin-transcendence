from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _
from django.shortcuts import redirect
from django.utils.translation import activate
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse

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
	return render(request, 'game/hello.html')

def offline_game(request):
    return render(request, 'game/offline-game.html')

def test(request):
    request_user_id = request.user.id
    return render(request, 'game/test.html', {'request_user_id':request_user_id,})

def json(request):
    if request.method == 'GET':
            # Prepare your data here
            data = {
                'message': 'This is the data fetched from the server.',
                'status': 'success'
            }
            return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

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

def tournament(request):
    if request.user.is_authenticated:
        return render(request, 'game/tour.html')
    else:
        return redirect('/')

@login_required
def tour_game(request, session_id=None):
    if request.user.is_authenticated:
        return render(request, 'game/tour-game.html')
    else:
        return redirect('/')

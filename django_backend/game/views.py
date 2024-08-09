from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _
from django.shortcuts import redirect
from django.utils.translation import activate
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from users.forms import UpdateAvatarForm
import logging
from django.views.decorators.csrf import csrf_exempt
import json

logger = logging.getLogger('django')

# Required for the language
def set_language(request):
    if request.method == 'POST':
        language = request.POST.get('language')
        if language:
            request.session[translation.LANGUAGE_SESSION_KEY] = language
            activate(language)
            logger.info(f'Language set to {language}')

    next_url = request.POST.get('next') or '/'
    return redirect(next_url)


# Create your views here.

# @login_required
def get_started(request):
    logger.info('main page visited')
    SignUpForm = UserCreationForm()
    AvatarForm = UpdateAvatarForm()
    return render(request, 'game/index.html', {'UserCreationForm': SignUpForm, 'UpdateAvatarForm': AvatarForm,})

@login_required
def get_username(request):
    logger.info('username requested')
    return JsonResponse({'username': request.user.username})

@csrf_exempt
def log_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            level = data.get('level', 'info').lower()
            message = data.get('message', '')

            if level == 'info':
                logger.info(message)
            elif level == 'warning':
                logger.warning(message)
            elif level == 'error':
                logger.error(message)
            elif level == 'critical':
                logger.critical(message)
            else:
                logger.debug(message)
            return JsonResponse({'status': 'success'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

# def offline_game(request):
#     return render(request, 'game/offline-game.html')

# def offline_tour(request):
#     return render(request, 'game/offline-tour.html')

# @login_required
# def game_start(request):
# 	return render(request, 'game/index.html', {})

# def two_pl_game(request):
#     if request.user.is_authenticated:
#         return render(request, 'game/two-pl-game.html')
#     else:
#         return redirect('/')

# def four_pl_game(request):
#     if request.user.is_authenticated:
#         return render(request, 'game/four-pl-game.html')
#     else:
#         return redirect('/')
    
# def tournament(request):
#     if request.user.is_authenticated:
#         return render(request, 'game/tour.html')
#     else:
#         return redirect('/')

# @login_required
# def tour_game(request, session_id=None):
#     if request.user.is_authenticated:
#         return render(request, 'game/tour-game.html')
#     else:
#         return redirect('/')
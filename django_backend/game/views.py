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
    return render(request, 'game/index.html', {'UserCreationForm': SignUpForm, 'UpdateAvatarForm': AvatarForm, 'is_authenticated': str(request.user.is_authenticated),})

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

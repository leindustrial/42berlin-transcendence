from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _

# Create your views here.
@login_required
def game_start(request):
	return render(request, 'game/index.html', {})

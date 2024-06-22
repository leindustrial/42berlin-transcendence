from django.shortcuts import render
from django.http import HttpResponse
from django.utils.translation import gettext_lazy as _

# Create your views here.
def game_start(request):
	return render(request, 'game/index.html', {})

from django.shortcuts import render

# Create your views here.
def game_start(request):
	return render(request, 'game/index.html', {})

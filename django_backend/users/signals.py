from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
	user.profile.online_status=True
	user.profile.save()
	# print("user {} logged in, online status = {}".format(user.username, user.profile.online_status))


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
	user.profile.online_status=False
	user.profile.save()
	# print("user {} logged out, online status = {}".format(user.username, user.profile.online_status))


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.create(user=instance)
	else:
		if not hasattr(instance, 'profile'):
			Profile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
# 	if not hasattr(instance, 'profile'):
# 		Profile.objects.create(user=instance)
# 	instance.profile.save()


from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

# Create your models here.
class Profile(models.Model):
	user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
	friends = models.ManyToManyField("self", related_name="friends_with", symmetrical=False, blank=True)
	display_name = models.CharField(max_length=12, null=True, blank=True, unique=True)
	avatar = models.ImageField(null=True, blank=True, upload_to="avatars/")
	wins = models.PositiveIntegerField(default=0)
	losses = models.PositiveIntegerField(default=0)
	online_status = models.BooleanField(default=False)
	match_history = models.TextField(null=True, blank=True)

	# for admin area
	def __str__(self):
		return str(self.user)

# # Catch changes on Django Built-In User Model with receiver signal
# # When a User is created in the User Model, a user will be created in the Profile model
# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
# 	if created:
# 		Profile.objects.create(user=instance)
# 	else:
# 		if not hasattr(instance, 'profile'):
# 			Profile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
# 	if not hasattr(instance, 'profile'):
# 		Profile.objects.create(user=instance)
# 	instance.profile.save()

# testing to delete the entries in Profile.friends
# @receiver(post_save, sender=Profile)
# def clear_friends_profile(sender, instance, created, **kwargs):
#  	if created:
# 		instance.friends.clear()
#		instance.save()

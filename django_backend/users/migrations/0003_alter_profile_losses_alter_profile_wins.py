# Generated by Django 5.0.6 on 2024-06-22 06:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_profile_friends_profile_losses_profile_wins'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='losses',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='profile',
            name='wins',
            field=models.PositiveIntegerField(default=0),
        ),
    ]

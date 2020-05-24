# Generated by Django 3.0.6 on 2020-05-24 01:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0004_auto_20200517_2105'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='display_priority',
            field=models.IntegerField(default=5),
        ),
        migrations.AddField(
            model_name='recipe',
            name='featured',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(default='Hi, I’m a new user!'),
        ),
    ]

# Generated by Django 3.0.5 on 2020-04-28 21:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0003_passwordrequest'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='PasswordRequest',
            new_name='PasswordResetRequest',
        ),
    ]
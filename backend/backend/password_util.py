import os
from django.conf import settings
from django.core.mail import send_mail


FROM_EMAIL = os.getenv('EMAIL_HOST_USER')


def send_password_reset_email(email, reset_code):
    subject = 'Feldberg’s Cookbook - Password Reset Request'
    message = 'Click to reset: localhost:3000/reset_password/{}'.format(reset_code)

    send_mail(
        subject,
        message,
        FROM_EMAIL,
        [email],
        fail_silently=True,
    )

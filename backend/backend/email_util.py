import os
from django.conf import settings
from django.core.mail import send_mail


PASSWORD_RESET_FROM_EMAIL = os.getenv('SES_PASSWORD_RESET_EMAIL')
DOMAIN_URL = os.getenv('DOMAIN_URL')

def send_password_reset_email(email, reset_code):
    reset_link = '{}/reset_password/{}'.format(DOMAIN_URL, reset_code)

    message = '''
        You’re receiving this e-mail because you requested a password reset for your Feldberg’s Cookbook account.
        Please paste this link into your browser to choose a new password: {reset_link}
    '''.format(reset_link=reset_link)

    html_message = '''
        <div>You’re receiving this e-mail because you requested a password reset for your Feldberg’s Cookbook account.</div>
        <br>
        <div>Please click the link below to choose a new password.</div>
        <br>
        <div><a href="{reset_link}">Reset Password</a></div>
        <br>
        Or copy and paste this link into your browser: {reset_link}
    '''.format(reset_link=reset_link)

    send_mail(
        subject='Reset your Feldberg’s Cookbook password',
        message=message,
        html_message=html_message,
        from_email=PASSWORD_RESET_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=True,
    )

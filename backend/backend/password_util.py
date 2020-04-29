from django.core.mail import send_mail

send_mail(
    'Feldberg’s Cookbook - Password Reset Request',
    'Click the following link to {}.{}'.format(ulid.new(), extension),
    'from@example.com',
    ['to@example.com'],
    fail_silently=False,
)
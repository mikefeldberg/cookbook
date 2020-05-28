import os

from unittest.mock import patch, ANY
from backend.password_util import send_password_reset_email
from tests.base import TestCaseBase


class PasswordUtilTestCase(TestCaseBase):
    @patch('backend.password_util.send_mail')
    def test_send_password_reset_email(self, mock_send_mail):
        reset_code = '1234'
        email = 'test_user@email.com'

        send_password_reset_email(email, reset_code)

        mock_send_mail.assert_called_once_with(
            subject='Feldberg’s Cookbook - Password Reset Request',
            message=ANY,
            html_message=ANY,
            from_email=os.getenv('EMAIL_HOST_USER'),
            recipient_list=[email],
            fail_silently=True,
        )

        reset_link = '{}/reset_password/{}'.format(os.getenv('DOMAIN_URL'), reset_code)

        self.assertIn(reset_link, mock_send_mail.mock_calls[0][2]['message'])
        self.assertIn(reset_link, mock_send_mail.mock_calls[0][2]['html_message'])

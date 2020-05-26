from recipes.models import User, PasswordResetRequest
from unittest.mock import patch, ANY
from django.contrib.auth import get_user_model
from tests import fixtures
from graphql_jwt.testcases import JSONWebTokenTestCase


class AuthTestCase(JSONWebTokenTestCase):
    def setUp(self):
        self.user = fixtures.create_user(username='test_user', email='test_user@email.com')

        self.create_user_mutation = '''
            mutation ($username: String!, $email: String!, $password: String!) {
                createUser(username: $username, email: $email, password: $password) {
                    user {
                        username
                        email
                    }
                }
            }
        '''

        self.token_auth_mutation = '''
            mutation ($username: String!, $password: String!) {
                tokenAuth(username: $username, password: $password) {
                    token
                }
            }
        '''

        self.create_password_reset_request_mutation = '''
            mutation ($email: String!) {
                createPasswordResetRequest(email: $email) {
                    passwordResetRequest {
                        resetCode
                        user {
                            id
                        }
                    }
                }
            }
        '''

    def test_create_user(self):
        self.assertEquals(User.objects.count(), 1)

        variables = {
            'username': 'chef_1',
            'email': 'chef_1@email.com',
            'password': 'password',
        }

        resp = self.client.execute(self.create_user_mutation, variables)

        expected_result = {
            'username': 'chef_1',
            'email': 'chef_1@email.com',
        }

        self.assertEquals(resp.data['createUser']['user'], expected_result)
        self.assertEquals(resp.errors, None)
        self.assertEquals(User.objects.count(), 2)

    def test_token_auth_success(self):
        correct_creds = {
            'username': 'test_user@email.com',
            'password': 'password',
        }

        resp = self.client.execute(self.token_auth_mutation, correct_creds)

        self.assertEquals(type(resp.data['tokenAuth']['token']), str)
        self.assertEquals(resp.errors, None)

    def test_token_auth_invalid_creds(self):
        invalid_creds = {
            'username': 'test_user@email.com',
            'password': 'P@ssword',
        }

        resp = self.client.execute(self.token_auth_mutation, invalid_creds)

        expected_error = 'Please enter valid credentials'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(resp.data['tokenAuth'], None)

    def test_password_reset_request_success_case_insensitive(self):
        variables = {
            'email': 'TEST_USER@email.com',
        }

        resp = self.client.execute(self.create_password_reset_request_mutation, variables)

        expected_result = {
            'resetCode': ANY,
            'user': {
                'id': str(self.user.id),
            }
        }

        self.assertEquals(resp.data['createPasswordResetRequest']['passwordResetRequest'], expected_result)
        self.assertEquals(resp.errors, None)
        self.assertEquals(PasswordResetRequest.objects.count(), 1)

    def test_password_reset_request_max_request_count_reached(self):
        variables = {
            'email': self.user.email,
        }

        for i in list(range(1, 6)):
            resp = self.client.execute(self.create_password_reset_request_mutation, variables)

            expected_result = {
                'resetCode': ANY,
                'user': {
                    'id': str(self.user.id),
                }
            }

            self.assertEquals(resp.data['createPasswordResetRequest']['passwordResetRequest'], expected_result)
            self.assertEquals(resp.errors, None)
            self.assertEquals(PasswordResetRequest.objects.count(), i)

        resp = self.client.execute(self.create_password_reset_request_mutation, variables)

        self.assertEquals(resp.data['createPasswordResetRequest']['passwordResetRequest'], None)
        self.assertEquals(resp.errors, None)
        self.assertEquals(PasswordResetRequest.objects.count(), 5)


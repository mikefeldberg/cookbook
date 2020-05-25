from recipes.models import User
from unittest.mock import patch, ANY
from django.contrib.auth import get_user_model
from tests import fixtures
from graphql_jwt.testcases import JSONWebTokenTestCase


class AuthTestCase(JSONWebTokenTestCase):
    def setUp(self):
        self.user = fixtures.create_user(username='test_user', email='test_user@email.com')

        self.create_user_query = '''
            mutation ($username: String!, $email: String!, $password: String!) {
                createUser(username: $username, email: $email, password: $password) {
                    user {
                        username
                        email
                    }
                }
            }
        '''

        self.token_auth_query = '''
            mutation ($username: String!, $password: String!) {
                tokenAuth(username: $username, password: $password) {
                    token
                }
            }
        '''

    def test_create_user_and_login(self):
        """
        Test creating a user, logging in with correct creds, logging in with incorrect creds
        """

        self.assertEquals(User.objects.count(), 1)

        variables = {
            'username': 'chef_1',
            'email': 'chef_1@email.com',
            'password': 'password',
        }

        resp = self.client.execute(self.create_user_query, variables)

        expected_result = {
            'username': 'chef_1',
            'email': 'chef_1@email.com',
        }

        self.assertEquals(resp.data['createUser']['user'], expected_result)
        self.assertEquals(resp.errors, None)
        self.assertEquals(User.objects.count(), 2)

        correct_creds = {
            'username': 'chef_1@email.com',
            'password': 'password',
        }

        resp = self.client.execute(self.token_auth_query, correct_creds)

        self.assertEquals(type(resp.data['tokenAuth']['token']), str)
        self.assertEquals(resp.errors, None)

        incorrect_creds = {
            'username': 'chef_1@email.com',
            'password': 'P@ssword',
        }

        resp = self.client.execute(self.token_auth_query, incorrect_creds)

        expected_error = 'Please enter valid credentials'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(resp.data['tokenAuth'], None)

    # TODO
    def z_test_create_user_duplicate_username(self):
        variables = {
            'username': 'test_user',
            'email': 'chef_1@email.com',
            'password': 'password',
        }

        resp = self.client.execute(self.create_user_query, variables)

        expected_error = 'duplicate key value violates unique constraint "recipes_user_username_key"'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(User.objects.count(), 1)

    # TODO
    def z_test_create_user_duplicate_email(self):
        variables = {
            'username': 'chef_1',
            'email': 'test_user@email.com',
            'password': 'password',
        }

        resp = self.client.execute(self.create_user_query, variables)

        expected_error = 'duplicate key value violates unique constraint "recipes_user_email_key"'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(User.objects.count(), 2)


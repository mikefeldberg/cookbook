from recipes.models import Recipe, Comment
from unittest.mock import patch, ANY
from django.contrib.auth import get_user_model
from django.utils import timezone
from tests import fixtures
import pendulum
from graphql_jwt.testcases import JSONWebTokenTestCase


class CommentTestCase(JSONWebTokenTestCase):
    def setUp(self):
        self.user = fixtures.create_user()
        self.recipe = fixtures.create_recipe(user_id=self.user.id)

        self.create_comment_mutation = '''
            mutation ($comment: CommentInput!) {
                createComment(comment: $comment) {
                    comment {
                        id
                        content
                        rating
                        createdAt
                        updatedAt
                        recipe {
                            id
                        }
                        user {
                            id
                            username
                        }
                    }
                }
            }
        '''

        self.update_comment_mutation = '''
            mutation ($comment: CommentInput!) {
                updateComment(comment: $comment) {
                    comment {
                        id
                        content
                        rating
                        createdAt
                        updatedAt
                        recipe {
                            id
                        }
                        user {
                            id
                            username
                        }
                    }
                }
            }
        '''

        self.delete_comment_mutation = '''
            mutation($commentId: String!) {
                deleteComment(commentId: $commentId) {
                    comment {
                        rating
                        recipeId
                    }
                }
            }
        '''

    def test_create_comment_success_without_rating(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 0,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        expected_result = {
            'id': ANY,
            'content': 'Best pancakes ever',
            'rating': 0,
            'createdAt': ANY,
            'updatedAt': ANY,
            'recipe': {
                'id': str(self.recipe.id),
            },
            'user': {
                'id': str(self.user.id),
                'username': self.user.username,
            },
        }

        created_comment = resp.data['createComment']['comment']
        self.assertEquals(created_comment, expected_result)
        self.assertEquals(pendulum.parse(created_comment['createdAt']).date(), timezone.now().date())
        self.assertEquals(pendulum.parse(created_comment['updatedAt']).date(), timezone.now().date())

        self.assertEquals(resp.errors, None)
        self.assertEquals(Comment.objects.count(), 1)
        self.assertEquals(self.recipe.rating, 0)
        self.assertEquals(self.recipe.rating_count, 0)

    def test_create_comment_success_with_rating_calculation(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Bestest pancakes ever',
                'rating': 5,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        self.recipe.refresh_from_db()

        self.assertEquals(Comment.objects.count(), 1)
        self.assertEquals(self.recipe.rating_count, 1)
        self.assertEquals(self.recipe.rating, 5)

        variables = {
            'comment': {
                'content': 'Okayest pancakes ever',
                'rating': 3,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        self.recipe.refresh_from_db()

        self.assertEquals(Comment.objects.count(), 2)
        self.assertEquals(self.recipe.rating_count, 2)
        self.assertEquals(self.recipe.rating, 4)

    def test_create_comment_no_user(self):
        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 0,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        expected_error = 'Log in to rate or comment'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Comment.objects.count(), 0)
        self.assertEquals(self.recipe.rating_count, 0)
        self.assertEquals(self.recipe.rating, 0)

    def test_create_comment_missing_recipe_id(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Bestest pancakes ever',
                'rating': 5,
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        self.recipe.refresh_from_db()

        expected_error = 'recipe_id'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Comment.objects.count(), 0)
        self.assertEquals(self.recipe.rating_count, 0)
        self.assertEquals(self.recipe.rating, 0)

    def test_create_comment_blank_recipe_id(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Bestest pancakes ever',
                'rating': 5,
                'recipeId': '',
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        self.recipe.refresh_from_db()

        expected_error = 'is not a valid UUID'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Comment.objects.count(), 0)
        self.assertEquals(self.recipe.rating_count, 0)
        self.assertEquals(self.recipe.rating, 0)

    def test_update_comment_success_with_rating_calculation(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 5,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        created_comment = resp.data['createComment']['comment']

        variables = {
            'comment': {
                'id': created_comment['id'],
                'content': 'My pancake had a hair in it',
                'rating': 1,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.update_comment_mutation, variables)

        self.recipe.refresh_from_db()

        expected_result = {
            'id': created_comment['id'],
            'content': 'My pancake had a hair in it',
            'rating': 1,
            'createdAt': ANY,
            'updatedAt': ANY,
            'recipe': {
                'id': str(self.recipe.id),
            },
            'user': {
                'id': str(self.user.id),
                'username': self.user.username,
            },
        }

        self.assertEquals(Comment.objects.count(), 1)
        self.assertEquals(self.recipe.rating_count, 1)
        self.assertEquals(self.recipe.rating, 1)

    def test_update_comment_unauthorized(self):
        comment = fixtures.create_comment(recipe_id=self.recipe.id, user_id=self.user.id)
        self.user_2 = fixtures.create_user(username='test_user_2', email='test_user_2@email.com')
        self.client.authenticate(self.user_2)

        variables = {
            'comment': {
                'id': str(comment.id),
                'content': 'My pancake had a hair in it',
                'rating': 1,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.update_comment_mutation, variables)

        expected_error = 'Update not permitted.'

        self.assertIn(expected_error, resp.errors[0].message)
        not_updated_comment = Comment.objects.first()
        self.assertEquals(not_updated_comment.content, comment.content)

    def test_update_comment_missing_recipe_id(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 5,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        created_comment = resp.data['createComment']['comment']

        variables = {
            'comment': {
                'id': created_comment['id'],
                'content': 'My pancake had a hair in it',
                'rating': 1,
            }
        }

        resp = self.client.execute(self.update_comment_mutation, variables)

        self.recipe.refresh_from_db()

        expected_error = 'recipe_vid'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(self.recipe.rating_count, 1)
        self.assertEquals(self.recipe.rating, 5)

    def test_update_comment_missing_comment_id(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 5,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        created_comment = resp.data['createComment']['comment']

        variables = {
            'comment': {
                'content': 'My pancake had a hair in it',
                'rating': 1,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.update_comment_mutation, variables)

        self.recipe.refresh_from_db()

        expected_error = 'id'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(self.recipe.rating_count, 1)
        self.assertEquals(self.recipe.rating, 5)

    def test_delete_comment_success_without_rating(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 0,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        self.recipe.refresh_from_db()

        created_comment = resp.data['createComment']['comment']

        self.assertEquals(Comment.objects.count(), 1)
        self.assertEquals(self.recipe.rating_count, 0)
        self.assertEquals(self.recipe.rating, 0)

        variables = {
            'commentId': created_comment['id'],
        }

        resp = self.client.execute(self.delete_comment_mutation, variables)

        deleted_comment = resp.data['deleteComment']['comment']

        expected_result = {
            'rating': 0,
            'recipeId': str(self.recipe.id),
        }

        self.assertEquals(deleted_comment, expected_result)

        self.assertEquals(Comment.objects.filter(deleted_at=None).count(), 0)
        self.assertEquals(self.recipe.rating_count, 0)
        self.assertEquals(self.recipe.rating, 0)

    def test_delete_comment_success_with_rating_calculation(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 5,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        self.recipe.refresh_from_db()

        created_comment = resp.data['createComment']['comment']

        self.assertEquals(Comment.objects.count(), 1)
        self.assertEquals(self.recipe.rating_count, 1)
        self.assertEquals(self.recipe.rating, 5)

        variables = {
            'commentId': created_comment['id'],
        }

        resp = self.client.execute(self.delete_comment_mutation, variables)

        self.recipe.refresh_from_db()

        deleted_comment = resp.data['deleteComment']['comment']

        expected_result = {
            'rating': 5,
            'recipeId': str(self.recipe.id),
        }

        self.assertEquals(deleted_comment, expected_result)

        self.assertEquals(Comment.objects.filter(deleted_at=None).count(), 0)
        self.assertEquals(self.recipe.rating_count, 0)
        self.assertEquals(self.recipe.rating, 0)

    def test_delete_comment_unauthorized(self):
        comment = fixtures.create_comment(recipe_id=self.recipe.id, user_id=self.user.id)
        self.user_2 = fixtures.create_user(username='test_user_2', email='test_user_2@email.com')
        self.client.authenticate(self.user_2)

        variables = {
            'commentId': str(comment.id),
        }

        resp = self.client.execute(self.delete_comment_mutation, variables)

        expected_error = 'Delete not permitted.'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Comment.objects.filter(deleted_at=None).count(), 1)

    def test_delete_comment_missing_id(self):
        self.client.authenticate(self.user)

        variables = {
            'comment': {
                'content': 'Best pancakes ever',
                'rating': 5,
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_comment_mutation, variables)

        self.recipe.refresh_from_db()

        variables = {
            'commentId': None,
        }

        resp = self.client.execute(self.delete_comment_mutation, variables)

        self.assertEquals(Comment.objects.filter(deleted_at=None).count(), 1)

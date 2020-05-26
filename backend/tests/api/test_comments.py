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
        self.client.authenticate(self.user)
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

        self.update_recipe_mutation = '''
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

        self.delete_recipe_mutation = '''
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

    # def test_create_recipe_missing_required_fields(self):
    #     variables = {
    #         'recipe': {
    #             'title': 'Blueberry Buttermilk Pancakes',
    #             'description': 'The perfect lazy Sunday breakfast.',
    #             'skillLevel': 'Easy',
    #         }
    #     }

    #     resp = self.client.execute(self.create_recipe_mutation, variables)

    #     expected_error = 'Variable "$recipe" got invalid value'

    #     self.assertIn(expected_error, resp.errors[0].message)
    #     self.assertEquals(Recipe.objects.count(), 0)

    # def test_update_recipe_success(self):
    #     recipe = fixtures.create_recipe(user_id=self.user.id)

    #     variables = {
    #         'recipe': {
    #             'id': str(recipe.id),
    #             'title': 'Not pancakes',
    #             'description': 'The perfect lazy Sunday breakfast.',
    #             'skillLevel': 'Easy',
    #             'prepTime': 66,
    #             'cookTime': 66,
    #             'waitTime': 66,
    #             'servings': 66,
    #             'ingredients': [{
    #                 'quantity': '1',
    #                 'name': 'cake',
    #                 'preparation': 'panned',
    #             }, {
    #                 'quantity': '1 cup',
    #                 'name': 'blueberries',
    #                 'preparation': 'fresh or frozen'
    #             }],
    #             'instructions': [{
    #                 'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
    #                 'order': 1,
    #             }, {
    #                 'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
    #                 'order': 2,
    #             }],
    #         }
    #     }

    #     resp = self.client.execute(self.update_recipe_mutation, variables)

    #     expected_result = {
    #         'id': str(recipe.id),
    #         'title': 'Not pancakes',
    #         'description': 'The perfect lazy Sunday breakfast.',
    #         'skillLevel': 'Easy',
    #         'prepTime': 66,
    #         'cookTime': 66,
    #         'waitTime': 66,
    #         'totalTime': 198,
    #         'servings': 66,
    #         'ingredients': [{
    #             'quantity': '1',
    #             'name': 'cake',
    #             'preparation': 'panned',
    #         }, {
    #             'quantity': '1 cup',
    #             'name': 'blueberries',
    #             'preparation': 'fresh or frozen'
    #         }],
    #         'instructions': [{
    #             'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
    #             'order': 1,
    #         }, {
    #             'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
    #             'order': 2,
    #         }],
    #         'photos': [],
    #     }

    #     self.assertEquals(resp.data['updateRecipe']['recipe'], expected_result)
    #     self.assertEquals(resp.errors, None)
    #     self.assertEquals(Recipe.objects.count(), 1)

    #     updated_recipe = Recipe.objects.first()
    #     self.assertEquals(updated_recipe.title, variables['recipe']['title'])

    # def test_update_recipe_missing_required_fields(self):
    #     recipe = fixtures.create_recipe(user_id=self.user.id)

    #     variables = {
    #         'recipe': {
    #             'id': str(recipe.id),
    #             'title': 'Not pancakes',
    #         }
    #     }

    #     resp = self.client.execute(self.update_recipe_mutation, variables)

    #     expected_error = 'Variable "$recipe" got invalid value'

    #     self.assertIn(expected_error, resp.errors[0].message)
    #     self.assertEquals(Recipe.objects.count(), 1)
    #     recipe_from_db = Recipe.objects.first()
    #     self.assertNotEquals(recipe_from_db.title, variables['recipe']['title'])

    # def test_delete_recipe_success(self):
    #     recipe = fixtures.create_recipe(user_id=self.user.id)

    #     variables = {
    #         'recipeId': str(recipe.id),
    #     }

    #     resp = self.client.execute(self.delete_recipe_mutation, variables)

    #     expected_result = {
    #         'id': str(recipe.id),
    #     }

    #     self.assertEquals(Recipe.objects.filter(deleted_at=None).count(), 0)

    # def test_delete_recipe_missing_id(self):
    #     recipe = fixtures.create_recipe(user_id=self.user.id)

    #     variables = {
    #         'recipeId': None,
    #     }

    #     resp = self.client.execute(self.delete_recipe_mutation, variables)

    #     expected_result = {
    #         'id': str(recipe.id),
    #     }

    #     self.assertEquals(Recipe.objects.filter(deleted_at=None).count(), 1)

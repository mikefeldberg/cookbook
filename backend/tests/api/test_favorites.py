from recipes.models import Recipe, Favorite
from unittest.mock import patch, ANY
from django.contrib.auth import get_user_model
from tests import fixtures
from graphql_jwt.testcases import JSONWebTokenTestCase

class FavoriteTestCase(JSONWebTokenTestCase):
    def setUp(self):
        self.user = fixtures.create_user()
        self.recipe = fixtures.create_recipe(user_id=self.user.id)

        self.create_favorite_mutation = '''
            mutation ($favorite: FavoriteInput!) {
                createFavorite(favorite: $favorite) {
                    favorite {
                        user {
                            id
                            username
                        }
                        recipe {
                            id
                            title
                        }
                    }
                }
            }
        '''

        self.delete_favorite_mutation = '''
            mutation($recipeId: String!) {
                deleteFavorite(recipeId: $recipeId) {
                    recipeId
                }
            }
        '''

    def test_create_favorite_success(self):
        self.client.authenticate(self.user)

        self.assertEquals(self.recipe.favorite_count, 0)

        variables = {
            'favorite': {
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_favorite_mutation, variables)

        self.recipe.refresh_from_db()

        expected_result = {
            'user': {
                'id': str(self.user.id),
                'username': self.user.username,
            },
            'recipe': {
                'id': str(self.recipe.id),
                'title': self.recipe.title,
            },
        }

        self.assertEquals(resp.data['createFavorite']['favorite'], expected_result)
        self.assertEquals(self.recipe.favorite_count, 1)

    def test_create_favorite_no_user(self):
        self.assertEquals(self.recipe.favorite_count, 0)

        variables = {
            'favorite': {
                'recipeId': str(self.recipe.id),
            }
        }

        resp = self.client.execute(self.create_favorite_mutation, variables)

        self.recipe.refresh_from_db()

        expected_error = 'Log in to rate or favorite'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(self.recipe.favorite_count, 0)

    def test_create_favorite_missing_recipe_id(self):
        self.client.authenticate(self.user)
        self.assertEquals(self.recipe.favorite_count, 0)

        variables = {
            'favorite': {
            }
        }

        resp = self.client.execute(self.create_favorite_mutation, variables)

        self.recipe.refresh_from_db()

        expected_error = 'Recipe matching query does not exist.'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(self.recipe.favorite_count, 0)

    def test_create_favorite_blank_recipe_id(self):
        self.assertEquals(self.recipe.favorite_count, 0)

        variables = {
            'favorite': {
                'recipeId': '',
            }
        }

        resp = self.client.execute(self.create_favorite_mutation, variables)

        self.recipe.refresh_from_db()

        expected_error = 'is not a valid UUID.'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(self.recipe.favorite_count, 0)

    def test_delete_favorite_success(self):
        self.client.authenticate(self.user)
        self.assertEquals(self.recipe.favorite_count, 0)

        variables = {
            'favorite': {
                'recipeId': str(self.recipe.id),
            }
        }

        self.client.execute(self.create_favorite_mutation, variables)

        self.recipe.refresh_from_db()

        self.assertEquals(self.recipe.favorite_count, 1)
        self.assertEquals(Favorite.objects.filter(deleted_at=None).count(), 1)

        variables = {
            'recipeId': str(self.recipe.id)
        }

        expected_result = {
            'recipeId': str(self.recipe.id)
        }

        resp = self.client.execute(self.delete_favorite_mutation, variables)

        self.recipe.refresh_from_db()

        self.assertEquals(resp.data['deleteFavorite!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'], expected_result)
        self.assertEquals(self.recipe.favorite_count, 0)
        self.assertEquals(Favorite.objects.filter(deleted_at=None).count(), 0)


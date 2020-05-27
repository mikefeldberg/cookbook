from recipes.models import Recipe
from unittest.mock import patch, ANY
from django.contrib.auth import get_user_model
from tests import fixtures
from graphql_jwt.testcases import JSONWebTokenTestCase


class RecipeTestCase(JSONWebTokenTestCase):
    def setUp(self):
        self.user = fixtures.create_user()

        self.create_recipe_mutation = '''
            mutation ($recipe: RecipeInput!) {
                createRecipe(recipe: $recipe) {
                    recipe {
                        id
                        title
                        description
                        skillLevel
                        prepTime
                        cookTime
                        waitTime
                        totalTime
                        servings
                        ingredients {
                            name
                            preparation
                            quantity
                        }
                        instructions {
                            order
                            content
                        }
                        rating
                        ratingCount
                        favoriteCount
                        photos {
                            id
                            url
                        }
                        comments {
                            id
                        }
                        user {
                            id
                            username
                        }
                        favorites {
                            id
                            user {
                                id
                            }
                        }
                    }
                }
            }
        '''

        self.update_recipe_mutation = '''
            mutation ($recipe: RecipeInput!) {
                updateRecipe(recipe: $recipe) {
                    recipe {
                        id
                        title
                        description
                        skillLevel
                        prepTime
                        cookTime
                        waitTime
                        totalTime
                        servings
                        ingredients {
                            name
                            preparation
                            quantity
                        }
                        instructions {
                            order
                            content
                        }
                        photos {
                            id
                            url
                        }
                    }
                }
            }
        '''

        self.delete_recipe_mutation = '''
            mutation($recipeId: String!) {
                deleteRecipe(recipeId: $recipeId) {
                    recipeId
                }
            }
        '''

    def test_create_recipe_success(self):
        self.client.authenticate(self.user)

        variables = {
            'recipe': {
                'title': 'Blueberry Buttermilk Pancakes',
                'description': 'The perfect lazy Sunday breakfast.',
                'skillLevel': 'Easy',
                'prepTime': 15,
                'cookTime': 25,
                'waitTime': 0,
                'servings': 4,
                'ingredients': [{
                    'quantity': '2 cups',
                    'name': 'all-purpose-flour',
                    'preparation': '',
                }, {
                    'quantity': '1 cup',
                    'name': 'blueberries',
                    'preparation': 'fresh or frozen'
                }],
                'instructions': [{
                    'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
                    'order': 1,
                }, {
                    'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
                    'order': 2,
                }],
            }
        }

        resp = self.client.execute(self.create_recipe_mutation, variables)

        expected_result = {
            'id': ANY,
            'title': 'Blueberry Buttermilk Pancakes',
            'description': 'The perfect lazy Sunday breakfast.',
            'skillLevel': 'Easy',
            'prepTime': 15,
            'cookTime': 25,
            'waitTime': 0,
            'totalTime': 40,
            'servings': 4,
            'ingredients': [{
                'quantity': '2 cups',
                'name': 'all-purpose-flour',
                'preparation': '',
            }, {
                'quantity': '1 cup',
                'name': 'blueberries',
                'preparation': 'fresh or frozen',
            }],
            'instructions': [{
                'order': 1,
                'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
            }, {
                'order': 2,
                'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
            }],
            'rating': 0.0,
            'ratingCount': 0,
            'favoriteCount': 0,
            'photos': [],
            'comments': [],
            'user': {
                'id': str(self.user.id),
                'username': self.user.username,
            },
            'favorites': [],
        }

        self.assertEquals(resp.data['createRecipe']['recipe'], expected_result)
        self.assertEquals(resp.errors, None)
        self.assertEquals(Recipe.objects.count(), 1)
        new_recipe = Recipe.objects.first()
        self.assertEquals(new_recipe.user.id, self.user.id)

    def test_create_recipe_no_user(self):
        variables = {
            'recipe': {
                'title': 'Blueberry Buttermilk Pancakes',
                'description': 'The perfect lazy Sunday breakfast.',
                'skillLevel': 'Easy',
                'prepTime': 15,
                'cookTime': 25,
                'waitTime': 0,
                'servings': 4,
                'ingredients': [{
                    'quantity': '2 cups',
                    'name': 'all-purpose-flour',
                    'preparation': '',
                }, {
                    'quantity': '1 cup',
                    'name': 'blueberries',
                    'preparation': 'fresh or frozen'
                }],
                'instructions': [{
                    'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
                    'order': 1,
                }, {
                    'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
                    'order': 2,
                }],
            }
        }

        resp = self.client.execute(self.create_recipe_mutation, variables)

        expected_error = 'Log in to add a recipe'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Recipe.objects.count(), 0)

    def test_create_recipe_missing_required_fields(self):
        self.client.authenticate(self.user)

        variables = {
            'recipe': {
                'title': 'Blueberry Buttermilk Pancakes',
                'description': 'The perfect lazy Sunday breakfast.',
                'skillLevel': 'Easy',
            }
        }

        resp = self.client.execute(self.create_recipe_mutation, variables)

        expected_error = 'Variable "$recipe" got invalid value'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Recipe.objects.count(), 0)

    def test_update_recipe_success(self):
        self.client.authenticate(self.user)

        recipe = fixtures.create_recipe(user_id=self.user.id)

        variables = {
            'recipe': {
                'id': str(recipe.id),
                'title': 'Not pancakes',
                'description': 'The perfect lazy Sunday breakfast.',
                'skillLevel': 'Easy',
                'prepTime': 66,
                'cookTime': 66,
                'waitTime': 66,
                'servings': 66,
                'ingredients': [{
                    'quantity': '1',
                    'name': 'cake',
                    'preparation': 'panned',
                }, {
                    'quantity': '1 cup',
                    'name': 'blueberries',
                    'preparation': 'fresh or frozen'
                }],
                'instructions': [{
                    'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
                    'order': 1,
                }, {
                    'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
                    'order': 2,
                }],
            }
        }

        resp = self.client.execute(self.update_recipe_mutation, variables)

        expected_result = {
            'id': str(recipe.id),
            'title': 'Not pancakes',
            'description': 'The perfect lazy Sunday breakfast.',
            'skillLevel': 'Easy',
            'prepTime': 66,
            'cookTime': 66,
            'waitTime': 66,
            'totalTime': 198,
            'servings': 66,
            'ingredients': [{
                'quantity': '1',
                'name': 'cake',
                'preparation': 'panned',
            }, {
                'quantity': '1 cup',
                'name': 'blueberries',
                'preparation': 'fresh or frozen'
            }],
            'instructions': [{
                'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
                'order': 1,
            }, {
                'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
                'order': 2,
            }],
            'photos': [],
        }

        self.assertEquals(resp.data['updateRecipe']['recipe'], expected_result)
        self.assertEquals(resp.errors, None)
        self.assertEquals(Recipe.objects.count(), 1)

        updated_recipe = Recipe.objects.first()
        self.assertEquals(updated_recipe.title, variables['recipe']['title'])

    def test_update_recipe_unauthorized(self):
        recipe = fixtures.create_recipe(user_id=self.user.id)
        self.user_2 = fixtures.create_user(username='test_user_2', email='test_user_2@email.com')
        self.client.authenticate(self.user_2)

        variables = {
            'recipe': {
                'id': str(recipe.id),
                'title': 'Not pancakes',
                'description': 'The perfect lazy Sunday breakfast.',
                'skillLevel': 'Easy',
                'prepTime': 66,
                'cookTime': 66,
                'waitTime': 66,
                'servings': 66,
                'ingredients': [{
                    'quantity': '1',
                    'name': 'cake',
                    'preparation': 'panned',
                }, {
                    'quantity': '1 cup',
                    'name': 'blueberries',
                    'preparation': 'fresh or frozen'
                }],
                'instructions': [{
                    'content': 'Prepare your dry mix in the large bowl: Sift together the flour, baking powder, baking soda, and salt.',
                    'order': 1,
                }, {
                    'content': 'Separate egg whites and yolks between the other two bowls: whites in the larger bowl, yolks in the smaller.',
                    'order': 2,
                }],
            }
        }

        resp = self.client.execute(self.update_recipe_mutation, variables)

        expected_error = 'Update not permitted.'

        self.assertIn(expected_error, resp.errors[0].message)
        not_updated_recipe = Recipe.objects.first()
        self.assertEquals(not_updated_recipe.title, recipe.title)

    def test_update_recipe_missing_required_fields(self):
        self.client.authenticate(self.user)

        recipe = fixtures.create_recipe(user_id=self.user.id)

        variables = {
            'recipe': {
                'id': str(recipe.id),
                'title': 'Not pancakes',
            }
        }

        resp = self.client.execute(self.update_recipe_mutation, variables)

        expected_error = 'Variable "$recipe" got invalid value'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Recipe.objects.count(), 1)
        recipe_from_db = Recipe.objects.first()
        self.assertNotEquals(recipe_from_db.title, variables['recipe']['title'])

    def test_delete_recipe_success(self):
        self.client.authenticate(self.user)

        recipe = fixtures.create_recipe(user_id=self.user.id)

        variables = {
            'recipeId': str(recipe.id),
        }

        resp = self.client.execute(self.delete_recipe_mutation, variables)

        expected_result = {
            'id': str(recipe.id),
        }

        self.assertEquals(Recipe.objects.filter(deleted_at=None).count(), 0)

    def test_delete_recipe_unauthorized(self):
        recipe = fixtures.create_recipe(user_id=self.user.id)
        self.user_2 = fixtures.create_user(username='test_user_2', email='test_user_2@email.com')
        self.client.authenticate(self.user_2)

        variables = {
            'recipeId': str(recipe.id),
        }

        resp = self.client.execute(self.delete_recipe_mutation, variables)

        expected_error = 'Delete not permitted.'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Recipe.objects.filter(deleted_at=None).count(), 1)

    def test_delete_recipe_missing_recipe_id(self):
        self.client.authenticate(self.user)

        recipe = fixtures.create_recipe(user_id=self.user.id)

        variables = {
            'recipeId': None,
        }

        resp = self.client.execute(self.delete_recipe_mutation, variables)

        expected_error = 'Variable "$recipeId" of required type "String!" was not provided.'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Recipe.objects.filter(deleted_at=None).count(), 1)

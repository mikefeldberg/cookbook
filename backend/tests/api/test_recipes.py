from recipes.models import Recipe
from unittest.mock import patch, ANY
from django.contrib.auth import get_user_model
from tests import fixtures
from graphql_jwt.testcases import JSONWebTokenTestCase


class RecipeTestCase(JSONWebTokenTestCase):
    def setUp(self):
        self.user = fixtures.create_user()
        self.client.authenticate(self.user)

        self.create_recipe_query = '''
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

    def test_create_recipe_success(self):
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

        resp = self.client.execute(self.create_recipe_query, variables)

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
            'favorites': [],
        }

        self.assertEquals(resp.data['createRecipe']['recipe'], expected_result)
        self.assertEquals(resp.errors, None)
        self.assertEquals(Recipe.objects.count(), 1)

    def test_create_recipe_missing_required_fields(self):
        variables = {
            'recipe': {
                'title': 'Blueberry Buttermilk Pancakes',
                'description': 'The perfect lazy Sunday breakfast.',
                'skillLevel': 'Easy',
            }
        }

        resp = self.client.execute(self.create_recipe_query, variables)

        expected_error = 'Variable "$recipe" got invalid value'

        self.assertIn(expected_error, resp.errors[0].message)
        self.assertEquals(Recipe.objects.count(), 0)


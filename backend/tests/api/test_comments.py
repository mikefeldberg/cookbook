from django.test import TestCase
from unittest.mock import patch
from tests.api.base import GraphQLTestCaseBase


class CommentTestCase(GraphQLTestCaseBase):

    def test_comment_create(self):
        query = '''
            mutation ($recipe: RecipeInput!) {
                createRecipe(recipe: $recipe) {
                    recipe {
                        id
                        title
                        description
                        ingredients {
                            quantity
                            preparation
                            name
                        }
                        instructions {
                            description
                            order
                        }
                    }
                }
            }
        '''

        recipe_arg = {
            'recipe': {
                'title': '1',
                'description': '1',
                'ingredients': [{
                    'quantity': '1',
                    'preparation': '1',
                    'name': '1',
                }],
                'instructions': [{
                    'description': '1',
                    'order': 1,
                }],
                'servings': 1,
                'prepTime': 1,
                'cookTime': 1,
                # 'totalTime': 1,
            }
        }
        
        resp, data = self.send_query(query, recipe_arg)
        from IPython import embed; embed()
from recipes.models import User, Recipe, Ingredient, Instruction, Photo
from recipes.recipe_data import recipes as seeded_recipes
from django.contrib.auth import get_user_model


def create_user(username='test_user', email='test_user@email.com', password='password'):
    user = get_user_model().objects.create(username=username, email=email)
    user.set_password(password)

    return user


def create_recipe(user_id, recipe_args=None):
    recipe = seeded_recipes[4]

    if recipe_args:
        recipe.update(recipe_args)

    ingredients = recipe.pop('ingredients')
    instructions = recipe.pop('instructions')
    photo = recipe.pop('photo')

    new_recipe = Recipe(
        user_id=user_id,
        **recipe,
    )

    new_recipe.save()

    for ingredient in ingredients:
        new_ingredients.append(Ingredient(
            recipe_id=new_recipe.id,
            **ingredient,
        ))

    for idx, instruction in enumerate(instructions):
        new_instructions.append(Instruction(
            recipe_id=new_recipe.id,
            content=instruction,
            order=idx + 1,
        ))

    new_photos.append(Photo(
        recipe_id=new_recipe.id,
        url=photo,
    ))

    Ingredient.objects.bulk_create(new_ingredients)
    Instruction.objects.bulk_create(new_instructions)
    Photo.objects.bulk_create(new_photos)

    return new_recipe
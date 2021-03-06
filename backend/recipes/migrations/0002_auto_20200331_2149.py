# Generated by Django 3.0.4 on 2020-03-31 21:49
import os
from django.db import migrations
from ..recipe_data import recipes as recipe_data
from django.conf import settings


def seed_recipes(apps, schema_editor):
    if settings.TESTING:
        return

    Recipe = apps.get_model('recipes', 'Recipe')
    Ingredient = apps.get_model('recipes', 'Ingredient')
    Instruction = apps.get_model('recipes', 'Instruction')
    Photo = apps.get_model('recipes', 'Photo')
    User = apps.get_model(settings.AUTH_USER_MODEL)

    user = User(
        username=os.getenv('DEFAULT_USER_USERNAME'),
        email=os.getenv('DEFAULT_USER_EMAIL'),
    )

    user.save()

    new_ingredients = []
    new_instructions = []
    new_photos = []

    for recipe in recipe_data:
        ingredients = recipe.pop('ingredients')
        instructions = recipe.pop('instructions')
        photo = recipe.pop('photo')

        new_recipe = Recipe(
            user_id=user.id,
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


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_recipes),
    ]

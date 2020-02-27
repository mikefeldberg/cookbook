import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from datetime import datetime

from .models import Recipe, Ingredient, Instruction
from users.schema import UserType


class IngredientType(DjangoObjectType):
    quantity = graphene.String()
    preparation = graphene.String()
    name = graphene.String()

    class Meta:
        model = Ingredient


class IngredientInput(graphene.InputObjectType):
    quantity = graphene.String()
    name = graphene.String()
    preparation = graphene.String()


class InstructionType(DjangoObjectType):
    description = graphene.String()
    order = graphene.Int()

    class Meta:
        model = Instruction


class InstructionInput(graphene.InputObjectType):
    description = graphene.String()
    order = graphene.Int()


class RecipeType(DjangoObjectType):
    title = graphene.String()
    description = graphene.String()
    skill_level = graphene.String()
    prep_time = graphene.Int(required=True)
    wait_time = graphene.Int(required=False)
    cook_time = graphene.Int(required=True)
    total_time = graphene.Int(required=True)
    servings = graphene.Int(required=True)
    ingredients = graphene.List(IngredientType)
    instructions = graphene.List(InstructionType)

    class Meta:
        model = Recipe

    def resolve_ingredients(self, info):
        return Ingredient.objects.filter(recipe_id=self.id, deleted_at=None)

    def resolve_instructions(self, info):
        return Instruction.objects.filter(recipe_id=self.id, deleted_at=None)


class RecipeInput(graphene.InputObjectType):
    title = graphene.String()
    description = graphene.String()
    skill_level = graphene.String()
    prep_time = graphene.Int(required=True)
    wait_time = graphene.Int(required=False)
    cook_time = graphene.Int(required=True)
    total_time = graphene.Int(required=True)
    servings = graphene.Int(required=True)
    ingredients = graphene.List(IngredientInput)
    instructions = graphene.List(InstructionInput)


class Query(graphene.ObjectType):
    recipes = graphene.List(RecipeType, search=graphene.String())
    recipe = graphene.Field(RecipeType, id=graphene.String(required=True))

    def resolve_recipe(self, info, id):
        return Recipe.objects.get(id=id)

    def resolve_recipes(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(user__username__icontains=search)
            )

            return Recipe.objects.filter(filter, deleted_at=None)

        return Recipe.objects.filter(deleted_at=None)


class CreateRecipe(graphene.Mutation):
    recipe = graphene.Field(RecipeType)

    class Arguments:
        recipe = RecipeInput(required=True)

    def mutate(self, info, recipe):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a recipe')

        new_recipe = Recipe(
            title=recipe['title'],
            description=recipe['description'],
            skill_level=recipe['skill_level'],
            prep_time=recipe['prep_time'],
            wait_time=recipe['wait_time'],
            cook_time=recipe['cook_time'],
            total_time=recipe['total_time'],
            servings=recipe['servings'],
            user=user
        )

        new_recipe.save()

        new_ingredients = []

        for ingredient in recipe['ingredients']:
            new_ingredients.append(Ingredient(
                quantity=ingredient['quantity'],
                preparation=ingredient['preparation'],
                name=ingredient['name'],
                recipe=new_recipe,
            ))

        Ingredient.objects.bulk_create(new_ingredients)

        new_instructions = []

        for instruction in recipe['instructions']:
            new_instructions.append(Instruction(
                description=instruction['description'],
                order=instruction['order'],
                recipe=new_recipe
            ))

        Instruction.objects.bulk_create(new_instructions)

        return CreateRecipe(recipe=new_recipe)


class UpdateRecipe(graphene.Mutation):
    recipe = graphene.Field(RecipeType)

    class Arguments:
        recipe_id = graphene.String(required=True)
        title = graphene.String()
        description = graphene.String()
        skill_level = graphene.String()
        prep_time = graphene.Int(required=True)
        wait_time = graphene.Int(required=False)
        cook_time = graphene.Int(required=True)
        total_time = graphene.Int(required=True)
        servings = graphene.Int(required=True)

    def mutate(
        self,
        info,
        recipe_id,
        title,
        description,
        skill_level,
        prep_time,
        wait_time,
        cook_time,
        total_time,
        servings
    ):
        user = info.context.user
        recipe = Recipe.objects.get(id=recipe_id)

        if recipe.user != user:
            raise GraphQLError('You are not permitted to update this recipe.')

        recipe.title = title
        recipe.description = description
        recipe.skill_level = skill_level
        recipe.prep_time = prep_time
        recipe.wait_time = wait_time
        recipe.cook_time = cook_time
        recipe.total_time = total_time
        recipe.servings = servings

        recipe.save()

        return UpdateRecipe(recipe=recipe)


class DeleteRecipe(graphene.Mutation):
    recipe_id = graphene.String()

    class Arguments:
        recipe_id = graphene.String(required=True)

    def mutate(self, info, recipe_id):
        user = info.context.user
        recipe = Recipe.objects.get(id=recipe_id)

        if recipe.user != user:
            raise GraphQLError('Not permitted to delete this recipe.')

        recipe.deleted_at = datetime.now()
        recipe.save()

        return DeleteRecipe(recipe_id=recipe_id)


class Mutation(graphene.ObjectType):
    create_recipe = CreateRecipe.Field()
    update_recipe = UpdateRecipe.Field()
    delete_recipe = DeleteRecipe.Field()

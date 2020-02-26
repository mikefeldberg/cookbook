import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q

from .models import Recipe
from users.schema import UserType

class RecipeType(DjangoObjectType):
    class Meta:
        model = Recipe

class Query(graphene.ObjectType):
    recipes = graphene.List(RecipeType, search=graphene.String())

    def resolve_recipes(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(posted_by__username__icontains=search)
            )

            return Recipe.objects.filter(filter)
        
        return Recipe.objects.all()

class CreateRecipe(graphene.Mutation):
    recipe = graphene.Field(RecipeType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        skill_level = graphene.String()
        prep_time = graphene.Int(required=True)
        wait_time = graphene.Int(required=True)
        cook_time = graphene.Int(required=True)
        total_time = graphene.Int(required=True)
        servings = graphene.Int(required=True)

    def mutate(self, info, title, description, skill_level, prep_time, wait_time, cook_time, total_time, servings):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a recipe')

        recipe = Recipe(
            title=title,
            description=description,
            skill_level=skill_level,
            prep_time=prep_time,
            wait_time=wait_time,
            cook_time=cook_time,
            total_time=total_time,
            servings=servings,
        )

        recipe.save()

        return CreateRecipe(recipe=recipe)


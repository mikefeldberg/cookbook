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
    recipe = graphene.Field(RecipeType, id=graphene.String(required=True))

    def resolve_recipes(self, info, search=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(user__username__icontains=search)
            )

            return Recipe.objects.filter(filter)
        
        return Recipe.objects.all()

    def resolve_recipe(self, info, id):
        return Recipe.objects.get(id=id)

class CreateRecipe(graphene.Mutation):
    recipe = graphene.Field(RecipeType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        skill_level = graphene.String()
        prep_time = graphene.Int(required=True)
        wait_time = graphene.Int(required=False)
        cook_time = graphene.Int(required=True)
        total_time = graphene.Int(required=True)
        servings = graphene.Int(required=True)

    def mutate(self,
        info,
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
            user=user,
        )

        recipe.save()

        return CreateRecipe(recipe=recipe)

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

    def mutate(self,
        info,
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
        recipe.url = url

        recipe.save()

        return UpdateRecipe(recipe=recipe)

class Mutation(graphene.ObjectType):
    create_recipe = CreateRecipe.Field()
    # update_recipe = UpdateRecipe.Field()
    # delete_recipe = DeleteRecipe.Field()

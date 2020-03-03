import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from django.utils import timezone

from .models import Recipe, Ingredient, Instruction, Comment, Favorite
from users.schema import UserType

# from IPython import embed; embed()

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


class CommentType(DjangoObjectType):
    content = graphene.String()
    rating = graphene.Int()

    class Meta:
        model = Comment


class CommentInput(graphene.InputObjectType):
    content = graphene.String()
    rating = graphene.Int()
    recipe_id = graphene.String()


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
    id = graphene.String(required=False)
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
    comments = graphene.List(CommentType, search=graphene.String())
    comment = graphene.Field(CommentType, id=graphene.String(required=True))


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

    def resolve_comment(self, info, id):
        return Comment.objects.get(id=id)

    def resolve_comments(self, info, search=None):
        # if search:
        #     filter = (
        #         Q(content__icontains=search) |
        #         Q(description__icontains=search) |
        #         Q(user__username__icontains=search)
        #     )

        #     return Comment.objects.filter(filter, deleted_at=None)

        return Comment.objects.filter(deleted_at=None)


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
        recipe = RecipeInput(required=True)

    def mutate(self, info, recipe):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Log in to add a recipe')
        recipe_id = recipe['id']

        existing_recipe = Recipe.objects.filter(id=recipe_id, deleted_at=None).first()
         
        if not existing_recipe or existing_recipe.user != user:
            raise GraphQLError('Update not permitted.')
        
        existing_recipe.title = recipe.get('title')
        existing_recipe.description = recipe.get('description')
        existing_recipe.skill_level = recipe.get('skill_level')
        existing_recipe.prep_time = recipe.get('prep_time')
        existing_recipe.wait_time = recipe.get('wait_time')
        existing_recipe.cook_time = recipe.get('cook_time')
        existing_recipe.total_time = recipe.get('total_time')
        existing_recipe.servings = recipe.get('servings')
        existing_recipe.save()

        Ingredient.objects.filter(recipe_id=recipe_id, deleted_at=None).update(deleted_at=timezone.now())
        Instruction.objects.filter(recipe_id=recipe_id, deleted_at=None).update(deleted_at=timezone.now())

        new_ingredients = []

        for ingredient in recipe.get('ingredients'):
            new_ingredients.append(Ingredient(
                quantity=ingredient['quantity'],
                preparation=ingredient['preparation'],
                name=ingredient['name'],
                recipe=existing_recipe,
            ))

        Ingredient.objects.bulk_create(new_ingredients)

        new_instructions = []

        for instruction in recipe.get('instructions'):
            new_instructions.append(Instruction(
                description=instruction['description'],
                order=instruction['order'],
                recipe=existing_recipe,
            ))

        Instruction.objects.bulk_create(new_instructions)

        return UpdateRecipe(recipe=existing_recipe)


class DeleteRecipe(graphene.Mutation):
    recipe_id = graphene.String()

    class Arguments:
        recipe_id = graphene.String(required=True)

    def mutate(self, info, recipe_id):
        user = info.context.user
        recipe = Recipe.objects.filter(id=recipe_id, deleted_at=None).first()

        if not recipe or recipe.user != user:
            raise GraphQLError('Delete not permitted.')

        recipe.deleted_at = timezone.now()
        recipe.save()

        return DeleteRecipe(recipe_id=recipe_id)


class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        comment = CommentInput(required=True)

    def mutate(self, info, comment):
        user = info.context.user
        recipe = Recipe.objects.filter(id=comment.recipe_id, deleted_at=None).first()


        if user.is_anonymous:
            raise GraphQLError('Log in to rate or comment')

        new_comment = Comment(
            content=comment['content'],
            rating=comment['rating'],
            user=user,
            recipe=recipe
        )

        from IPython import embed; embed()

        new_comment.save()

        return CreateComment(comment=new_comment)


class UpdateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        comment = CommentInput(required=True)

    def mutate(self, info, comment):
        user = info.context.user
        recipe = Recipe.objects.filter(id=comment.recipe_id, deleted_at=None).first()

        if user.is_anonymous:
            raise GraphQLError('Log in to update ratings or comments')
        comment_id = comment['id']

        existing_comment = Comment.objects.filter(id=comment_id, deleted_at=None).first()

        if not existing_comment or existing_comment.user != user:
            raise GraphQLError('Update not permitted.')

        existing_comment = Comment(
            content=comment['content'],
            rating=comment['rating'],
        )

        existing_comment.save()

        return UpdateComment(comment=existing_comment)


class Mutation(graphene.ObjectType):
    create_recipe = CreateRecipe.Field()
    update_recipe = UpdateRecipe.Field()
    delete_recipe = DeleteRecipe.Field()
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()
    # delete_comment = DeleteComment.Field()

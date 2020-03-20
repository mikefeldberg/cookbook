import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from django.utils import timezone

from .models import Recipe, Ingredient, Instruction, Comment, Favorite, Photo
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
    content = graphene.String()
    order = graphene.Int()

    class Meta:
        model = Instruction


class InstructionInput(graphene.InputObjectType):
    content = graphene.String()
    order = graphene.Int()


class PhotoType(DjangoObjectType):
    url = graphene.String()
    recipe_id = graphene.String()

    class Meta:
        model = Photo


class PhotoInput(graphene.InputObjectType):
    id = graphene.String(required=False)
    url = graphene.String()
    recipe_id = graphene.String()


class CommentType(DjangoObjectType):
    content = graphene.String()
    rating = graphene.Int()
    recipe_id = graphene.String()
    created_at = graphene.types.datetime.DateTime()
    updated_at = graphene.types.datetime.DateTime()

    class Meta:
        model = Comment


class CommentInput(graphene.InputObjectType):
    id = graphene.String(required=False)
    content = graphene.String()
    rating = graphene.Int()
    recipe_id = graphene.String(required=False)


class FavoriteType(DjangoObjectType):

    class Meta:
        model = Favorite


class FavoriteInput(graphene.InputObjectType):
    recipe_id = graphene.String()


class RecipeType(DjangoObjectType):
    title = graphene.String()
    description = graphene.String()
    skill_level = graphene.String()
    prep_time = graphene.Int(required=True)
    cook_time = graphene.Int(required=True)
    wait_time = graphene.Int(required=False)
    total_time = graphene.Int(required=True)
    servings = graphene.Int(required=True)
    ingredients = graphene.List(IngredientType)
    instructions = graphene.List(InstructionType)
    rating = graphene.Float()
    rating_count = graphene.Int(required=False)
    favorite_count = graphene.Int(required=False)
    comment_count = graphene.Int(required=False)

    class Meta:
        model = Recipe

    def resolve_ingredients(self, info):
        return Ingredient.objects.filter(recipe_id=self.id, deleted_at=None)

    def resolve_instructions(self, info):
        return Instruction.objects.filter(recipe_id=self.id, deleted_at=None)

    def resolve_comments(self, info):
        return Comment.objects.filter(recipe_id=self.id, deleted_at=None).order_by('-created_at')

    def resolve_photos(self, info):
        return Photo.objects.filter(recipe_id=self.id, deleted_at=None)

    def resolve_favorites(self, info):
        return Favorite.objects.filter(recipe_id=self.id, deleted_at=None)


class RecipeInput(graphene.InputObjectType):
    id = graphene.String(required=False)
    title = graphene.String()
    description = graphene.String()
    skill_level = graphene.String()
    prep_time = graphene.Int(required=True)
    cook_time = graphene.Int(required=True)
    wait_time = graphene.Int(required=False)
    servings = graphene.Int(required=True)
    ingredients = graphene.List(IngredientInput)
    instructions = graphene.List(InstructionInput)


class Query(graphene.ObjectType):
    recipes = graphene.List(RecipeType, search=graphene.String())
    recipe = graphene.Field(RecipeType, id=graphene.String(required=True))
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
        return Comment.objects.filter(id=id)


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
            cook_time=recipe['cook_time'],
            wait_time=recipe['wait_time'],
            total_time=recipe['prep_time'] + recipe['cook_time'] + recipe['wait_time'],
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
                content=instruction['content'],
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

        existing_recipe = Recipe.objects.filter(
            id=recipe_id, deleted_at=None).first()

        if not existing_recipe or existing_recipe.user != user:
            raise GraphQLError('Update not permitted.')

        existing_recipe.title = recipe['title']
        existing_recipe.description = recipe['description']
        existing_recipe.skill_level = recipe['skill_level']
        existing_recipe.prep_time = recipe['prep_time']
        existing_recipe.wait_time = recipe['wait_time']
        existing_recipe.cook_time = recipe['cook_time']
        existing_recipe.total_time = recipe['prep_time'] + recipe['cook_time'] + recipe['wait_time']
        existing_recipe.servings = recipe['servings']
        existing_recipe.save()

        Ingredient.objects.filter(recipe_id=recipe_id, deleted_at=None).update(
            deleted_at=timezone.now())
        Instruction.objects.filter(recipe_id=recipe_id, deleted_at=None).update(
            deleted_at=timezone.now())

        new_ingredients = []

        for ingredient in recipe['ingredients']:
            new_ingredients.append(Ingredient(
                quantity=ingredient['quantity'],
                preparation=ingredient['preparation'],
                name=ingredient['name'],
                recipe=existing_recipe,
            ))

        Ingredient.objects.bulk_create(new_ingredients)

        new_instructions = []

        for instruction in recipe['instructions']:
            new_instructions.append(Instruction(
                content=instruction['content'],
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
        recipe = Recipe.objects.filter(id=comment['recipe_id'], deleted_at=None).first()

        if user.is_anonymous:
            raise GraphQLError('Log in to rate or comment')

        new_comment = Comment(
            content=comment['content'],
            rating=comment['rating'],
            user=user,
            recipe=recipe
        )

        new_comment.save()

        if comment['rating'] > 0:
            recipe.rating = (recipe.rating * recipe.rating_count + comment['rating']) / (recipe.rating_count + 1)
            recipe.rating_count += 1
            recipe.save()

        return CreateComment(comment=new_comment)


class UpdateComment(graphene.Mutation):
    comment = graphene.Field(CommentType)

    class Arguments:
        comment = CommentInput(required=True)

    def mutate(self, info, comment):
        user = info.context.user
        recipe = Recipe.objects.filter(
            id=comment['recipe_id'], deleted_at=None).first()

        if user.is_anonymous:
            raise GraphQLError('Log in to update ratings or comments')

        existing_comment = Comment.objects.filter(
            id=comment['id'], deleted_at=None).first()

        if not existing_comment or existing_comment.user != user:
            raise GraphQLError('Update not permitted.')

        if existing_comment.rating != comment['rating']:
            if existing_comment.rating > 0:
                if comment['rating'] > 0:
                    recipe.rating = (recipe.rating * recipe.rating_count - existing_comment.rating + comment['rating']) / (recipe.rating_count)

                if comment['rating'] == 0 and recipe.rating_count > 1:
                    recipe.rating = (recipe.rating * recipe.rating_count - existing_comment.rating) / (recipe.rating_count - 1)
                    recipe.rating_count -= 1

                if comment['rating'] == 0 and recipe.rating_count == 1:
                    recipe.rating = 0
                    recipe.rating_count = 0

            else:
                recipe.rating = (recipe.rating * recipe.rating_count + comment['rating']) / (recipe.rating_count + 1)
                recipe.rating_count += 1

            recipe.save()

        existing_comment.content = comment['content']
        existing_comment.rating = comment['rating']

        existing_comment.save()

        return UpdateComment(comment=existing_comment)


class DeleteComment(graphene.Mutation):
    recipe_id = graphene.String()

    class Arguments:
        comment_id = graphene.String(required=True)

    def mutate(self, info, comment_id):
        user = info.context.user
        comment = Comment.objects.filter(id=comment_id, deleted_at=None).first()
        recipe = Recipe.objects.get(id=comment.recipe_id, deleted_at=None)

        if not comment or comment.user != user:
            raise GraphQLError('Delete not permitted.')

        comment.deleted_at = timezone.now()
        comment.save()

        if comment.rating > 0:
            recipe.rating = (recipe.rating * recipe.rating_count - comment.rating) / (recipe.rating_count - 1)
            recipe.rating_count -= 1
            recipe.save()

        return DeleteComment(recipe_id=recipe.id)


class CreatePhoto(graphene.Mutation):
    photo = graphene.Field(PhotoType)

    class Arguments:
        photo = PhotoInput(required=True)

    def mutate(self, info, photo):
        recipe = Recipe.objects.get(id=photo.recipe_id, deleted_at=None)

        new_photo = Photo(
            url=photo.url,
            recipe=recipe
        )

        new_photo.save()

        return CreatePhoto(photo=new_photo)


class DeletePhoto(graphene.Mutation):
    photo_id = graphene.String()

    class Arguments:
        photo_id = graphene.String(required=True)

    def mutate(self, info, photo_id):
        photo = Photo.objects.get(id=photo_id, deleted_at=None)

        photo.deleted_at = timezone.now()
        photo.save()

        return DeletePhoto(photo_id=photo_id)


class CreateFavorite(graphene.Mutation):
    favorite = graphene.Field(FavoriteType)

    class Arguments:
        favorite = FavoriteInput(required=True)

    def mutate(self, info, favorite):
        user = info.context.user
        recipe = Recipe.objects.get(id=favorite.recipe_id, deleted_at=None)

        if user.is_anonymous:
            raise GraphQLError('Log in to rate or favorite')

        new_favorite = Favorite(
            user=user,
            recipe=recipe
        )

        new_favorite.save()

        recipe.favorite_count += 1
        recipe.save()

        return CreateFavorite(favorite=new_favorite)


class DeleteFavorite(graphene.Mutation):
    recipe_id = graphene.String()

    class Arguments:
        recipe_id = graphene.String(required=True)

    def mutate(self, info, recipe_id):
        user = info.context.user
        recipe = Recipe.objects.filter(id=recipe_id, deleted_at=None).first()
        favorite = Favorite.objects.filter(recipe_id=recipe_id, user_id=user.id, deleted_at=None).first()

        if not favorite or favorite.user != user:
            raise GraphQLError('Action not permitted.')

        favorite.deleted_at = timezone.now()
        favorite.save()

        recipe.favorite_count -= 1
        recipe.save()

        return DeleteFavorite(recipe_id=recipe.id)


class Mutation(graphene.ObjectType):
    create_recipe = CreateRecipe.Field()
    update_recipe = UpdateRecipe.Field()
    delete_recipe = DeleteRecipe.Field()
    create_photo = CreatePhoto.Field()
    # update_photo = UpdatePhoto.Field()
    delete_photo = DeletePhoto.Field()
    create_comment = CreateComment.Field()
    update_comment = UpdateComment.Field()
    delete_comment = DeleteComment.Field()
    create_favorite = CreateFavorite.Field()
    delete_favorite = DeleteFavorite.Field()

import os
from django.contrib.auth import get_user_model
import graphene
import uuid
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django_filters import FilterSet
from backend.password_util import send_password_reset_email
from django.utils import timezone
from datetime import timedelta

from recipes.models import Recipe, Comment, Favorite, PasswordResetRequest, UserPhoto

BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET')

class RecipeFilter(FilterSet):
    class Meta:
        model = Recipe
        fields = ['created_at', 'deleted_at']

    @property
    def qs(self):
        return super().qs.filter(deleted_at=None)


class CommentFilter(FilterSet):
    class Meta:
        model = Comment
        fields = ['created_at', 'deleted_at']

    @property
    def qs(self):
        return super().qs.filter(deleted_at=None)


class FavoriteFilter(FilterSet):
    class Meta:
        model = Favorite
        fields = ['created_at', 'deleted_at']

    @property
    def qs(self):
        return super().qs.filter(deleted_at=None)


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

    def resolve_recipe_set(self, info, **kwargs):
        return RecipeFilter(kwargs).qs.filter(user_id=self.id)

    def resolve_comment_set(self, info, **kwargs):
        return CommentFilter(kwargs).qs.filter(user_id=self.id)

    def resolve_favorite_set(self, info, **kwargs):
        return FavoriteFilter(kwargs).qs.filter(user_id=self.id)


class PasswordResetRequestType(DjangoObjectType):
    email = graphene.String()

    class Meta:
        model = PasswordResetRequest


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.String(required=True))
    profile = graphene.Field(UserType, id=graphene.String(required=True))
    me = graphene.Field(UserType)
    password_reset_request = graphene.Field(
        PasswordResetRequestType, reset_code=graphene.String(required=True))

    def resolve_profile(self, info, id):
        return get_user_model().objects.filter(id=id, deleted_at=None).first()

    def resolve_users(self, info):
        return get_user_model().objects.all()

    def resolve_user(self, info, id):
        return get_user_model().objects.filter(id=id).first()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            return None

        return user


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    def mutate(self, info, username, password, email):
        user = get_user_model()(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()

        return CreateUser(user=user)


class CreatePasswordResetRequest(graphene.Mutation):
    password_reset_request = graphene.Field(PasswordResetRequestType)

    class Arguments:
        email = graphene.String(required=True)

    def mutate(self, info, email):
        RESET_PASSWORD_EXPIRES_IN = {'minutes': 11}

        user = get_user_model().objects.filter(email=email).first()
        reset_code = uuid.uuid4()

        if user:
            new_password_reset_request = PasswordResetRequest(
                reset_code=reset_code,
                user=user,
                expires_at=timezone.now() + timedelta(**RESET_PASSWORD_EXPIRES_IN),
            )

            new_password_reset_request.save()
            send_password_reset_email(email, reset_code)

            return CreatePasswordResetRequest(password_reset_request=new_password_reset_request)

        return False


class ResetPassword(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        password = graphene.String(required=True)
        reset_code = graphene.String(required=True)

    def mutate(self, info, password, reset_code):
        password_reset_request = PasswordResetRequest.objects.filter(reset_code=reset_code).first()

        if password_reset_request and password_reset_request.expires_at > timezone.now():
            user = password_reset_request.user
            user.set_password(password)

            user.save()

            password_reset_request.expires_at = timezone.now()
            password_reset_request.save()

            return ResetPassword(user=user)

        return False


class CreateUserPhoto(graphene.Mutation):
    user_photo = graphene.Field(UserPhotoType)

    class Arguments:
        user_photo = UserPhotoInput(required=True)

    def mutate(self, info, user_photo):
        user = info.context.user

        new_user_photo = UserPhoto(
            url=user_photo.url,
            user=user
        )

        new_user_photo.save()

        return CreateUserPhoto(user_photo=new_user_photo)


class DeleteUserPhoto(graphene.Mutation):
    user_photo_id = graphene.String()

    class Arguments:
        user_photo_id = graphene.String(required=True)

    def mutate(self, info, user_photo_id):
        user_photo = UserPhoto.objects.get(id=user_photo_id, deleted_at=None)

        user_photo.deleted_at = timezone.now()
        user_photo.save()

        return DeleteUserPhoto(user_photo_id=user_photo_id)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_password_reset_request = CreatePasswordResetRequest.Field()
    reset_password = ResetPassword.Field()
    create_user_photo = CreateUserPhoto.Field()
    delete_user_photo = DeleteUserPhoto.Field()

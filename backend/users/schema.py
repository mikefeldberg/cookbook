from django.contrib.auth import get_user_model
from graphql import GraphQLError
import graphene
import uuid

from recipes.models import Recipe, Comment, Favorite, PasswordResetRequest
from graphene_django import DjangoObjectType
from django_filters import FilterSet

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

    def resolve_profile(self, info, id):
        return get_user_model().objects.get(id=id, deleted_at=None)

    def resolve_users(self, info):
        return get_user_model().objects.all()

    def resolve_user(self, info, id):
        return get_user_model().objects.get(id=id)

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
        new_password_reset_request = PasswordResetRequest(
            reset_code = uuid.uuid4(),
            user=get_user_model().objects.get(email=email),
        )

        new_password_reset_request.save()

        return CreatePasswordResetRequest(password_reset_request=new_password_reset_request)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_password_reset_request = CreatePasswordResetRequest.Field()

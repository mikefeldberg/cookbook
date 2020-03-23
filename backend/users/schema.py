from django.contrib.auth import get_user_model
from graphql import GraphQLError

import graphene
from graphene_django import DjangoObjectType


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    profile = graphene.Field(UserType, username=graphene.String(required=True))
    me = graphene.Field(UserType)

    def resolve_profile(self, info, username):
        user = get_user_model()
        user_recipes = user.recipe_set
        user_comments = user.comment_set
        user_favorites = user.favorite_set

        user_profile = (
            user_recipes
            user_comments
            user_favorites
        )

        from IPython import embed; embed()
        


        # return get_user_model().objects.get(username=username)
        return get_user_model().objects.get(username=username)

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


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()

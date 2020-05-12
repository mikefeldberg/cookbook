import os
from django.contrib import admin
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from . import s3

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=os.environ.get('GRAPHIQL')))),
    path('upload/<extension>', s3.create_presigned_post),
]

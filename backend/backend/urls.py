from django.contrib import admin
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt
from . import s3

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    # path('upload/', s3.create_presigned_post),
    path('upload/', s3.create_presigned_post),
    # path('download/<slug:bucket_name>/<slug:object_name>/', s3.print_hereiam),
    # path('download/<slug:bucket_name>/<slug:object_name>/', s3.create_presigned_url),
    # path('download/<bucket_name>/<object_name>/', s3.print_hereiam),
]

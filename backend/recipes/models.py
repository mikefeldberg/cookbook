from django.db import models
from django.contrib.auth import get_user_model
import uuid
from django.contrib.auth.models import AbstractUser


class StandardModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, error_messages={'unique': 'An account with this email address already exists.'}, verbose_name='email address')
    bio = models.TextField(default='Hi, I’m a new user!')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)


class PasswordResetRequest(StandardModel):
    reset_code = models.TextField(blank=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)


class Recipe(StandardModel):
    title = models.CharField(blank=False, max_length=50)
    description = models.TextField(blank=True)
    skill_level = models.TextField(blank=False)
    prep_time = models.IntegerField()
    cook_time = models.IntegerField()
    wait_time = models.IntegerField()
    total_time = models.IntegerField()
    servings = models.IntegerField()
    rating = models.FloatField(default=0)
    rating_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    display_priority = models.IntegerField(default=5)
    featured = models.BooleanField(default=False)
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)


class Ingredient(StandardModel):
    quantity = models.TextField(blank=False)
    preparation = models.TextField(blank=False)
    name = models.TextField(blank=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')


class Instruction(StandardModel):
    content = models.TextField(blank=False)
    order = models.IntegerField(blank=False, default=1)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='instructions')


class Comment(StandardModel):
    content = models.TextField(blank=True)
    rating = models.IntegerField()
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments')


class Favorite(StandardModel):
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='favorites')


class Photo(StandardModel):
    url = models.CharField(blank=False, max_length=300)

    class Meta:
        abstract = True


class RecipePhoto(Photo):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='photos')


class UserPhoto(Photo):
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE, related_name='photos')

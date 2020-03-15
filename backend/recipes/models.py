from django.db import models
from django.contrib.auth import get_user_model
import uuid


class StandardModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True


class Recipe(StandardModel):
    title = models.CharField(blank=False, max_length=50)
    description = models.TextField(blank=True)
    skill_level = models.TextField(blank=False)
    prep_time = models.IntegerField()
    wait_time = models.IntegerField()
    cook_time = models.IntegerField()
    total_time = models.IntegerField()
    servings = models.IntegerField()
    rating = models.FloatField(default=0)
    rating_count = models.IntegerField(default=0)
    favorite_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
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
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='photos')
    url = models.CharField(blank=False, max_length=300)

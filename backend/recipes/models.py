from django.db import models
from django.contrib.auth import get_user_model


class Recipe(models.Model):
    title = models.CharField(blank=False, max_length=50)
    description = models.TextField(blank=True)
    skill_level = models.TextField(blank=False)
    prep_time = models.IntegerField()
    cook_time = models.IntegerField()
    wait_time = models.IntegerField()
    total_time = models.IntegerField()
    servings = models.IntegerField()
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Ingredient(models.Model):
    quantity = models.TextField(blank=False)
    preparation = models.TextField(blank=False)
    name = models.TextField(blank=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Instruction(models.Model):
    description = models.TextField(blank=False)
    order = models.IntegerField(blank=False)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

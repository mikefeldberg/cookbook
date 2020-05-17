from django.contrib import admin

from .models import Recipe, Ingredient, Instruction, Comment, Favorite, RecipePhoto, UserPhoto, PasswordResetRequest

admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Instruction)
admin.site.register(Comment)
admin.site.register(Favorite)
admin.site.register(RecipePhoto)
admin.site.register(UserPhoto)
admin.site.register(PasswordResetRequest)
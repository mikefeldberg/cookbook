from django.contrib import admin

from .models import Recipe, Ingredient, Instruction, Comment, Favorite, Photo, PasswordResetRequest

admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Instruction)
admin.site.register(Comment)
admin.site.register(Favorite)
admin.site.register(Photo)
admin.site.register(PasswordResetRequest)
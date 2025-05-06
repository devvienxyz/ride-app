from django.contrib import admin
from users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id_user", "email", "first_name", "last_name", "role", "phone_number")
    search_fields = ("email", "first_name", "last_name")
    list_filter = ("role",)
    ordering = ("id_user",)
    list_per_page = 20
    list_display_links = ("id_user", "email")

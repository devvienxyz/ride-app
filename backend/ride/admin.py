from django.contrib import admin
from ride.models import Ride, RideEvent


@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = (
        "id_ride",
        "status",
        "id_rider",
        "id_driver",
        "pickup_time",
    )
    list_filter = ("status",)
    search_fields = ("id_rider__email", "id_driver__email")
    ordering = ("-pickup_time",)
    autocomplete_fields = ("id_rider", "id_driver")


@admin.register(RideEvent)
class RideEventAdmin(admin.ModelAdmin):
    list_display = (
        "id_ride_event",
        "id_ride",
        "description",
        "created_at",
    )
    search_fields = ("description",)
    list_filter = ("created_at",)
    ordering = ("-created_at",)
    autocomplete_fields = ("id_ride",)
    list_per_page = 20

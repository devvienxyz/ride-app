from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import RideEvent, Ride


@receiver(post_save, sender=Ride)
def create_event_on_create_and_status_change(sender, instance, created, **kwargs):
    # Creates a ride event on:
    #   - create of ride
    #   - change of ride status

    if created:
        RideEvent.objects.create(ride=instance, description=f"Ride created with initial status '{instance.status}'")
        return

    # only log the event if status changed
    if hasattr(instance, "_original_status") and instance.status != instance._original_status:
        RideEvent.objects.create(
            ride=instance, description=f"Ride status changed from '{instance._original_status}' to '{instance.status}'"
        )

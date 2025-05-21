from django.db import models


class Ride(models.Model):
    # TODO: set valid transitions

    STATUS_CHOICES = [
        ("requested", "Requested"),  # Ride created but not yet accepted.
        ("assigned", "Assigned"),  # Driver assigned but hasn't started en route
        ("en-route", "En Route"),  # Driver is on the way to pick up the passenger.
        ("pickup", "Pickup"),  # Driver has arrived at the pickup location.
        ("in-progress", "In Progress"),  # Passenger picked up, en route to dropoff.
        ("dropoff", "Dropoff"),  # Passenger is being or has been dropped off.
        ("completed", "Completed"),  # Ride completed successfully.
        ("cancelled", "Cancelled"),  # Ride was cancelled (by user, driver, or system).
        ("failed", "Failed"),  # Ride failed due to system/driver error.
    ]

    id_ride = models.AutoField(primary_key=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")
    id_rider = models.ForeignKey("users.User", related_name="rider_rides", on_delete=models.CASCADE)
    id_driver = models.ForeignKey("users.User", related_name="driver_rides", on_delete=models.CASCADE)
    pickup_latitude = models.FloatField()
    pickup_longitude = models.FloatField()
    dropoff_latitude = models.FloatField()
    dropoff_longitude = models.FloatField()
    pickup_time = models.DateTimeField()

    def __str__(self):
        return f"Ride {self.id_ride} - {self.status}"


class RideEvent(models.Model):
    id_ride_event = models.AutoField(primary_key=True)
    id_ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name="events")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RideEvent {self.id_ride_event} for Ride {self.id_ride}"

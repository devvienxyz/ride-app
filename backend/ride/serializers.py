from rest_framework import serializers
from django.utils.timezone import now, timedelta
from users.serializers import UserSerializer
from .models import Ride, RideEvent


class RideEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideEvent
        fields = ["id_ride_event", "id_ride", "description", "created_at"]
        read_only_fields = ["id_ride_event", "created_at"]


class RideSerializer(serializers.ModelSerializer):
    id_driver = UserSerializer()
    id_rider = UserSerializer()
    todays_ride_events = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = [
            "id_ride",
            "status",
            "pickup_latitude",
            "pickup_longitude",
            "dropoff_latitude",
            "dropoff_longitude",
            "pickup_time",
            "id_rider",
            "id_driver",
            "todays_ride_events",
        ]

    def get_todays_ride_events(self, ride):
        threshold = self.context.get("today_threshold", now() - timedelta(hours=24))
        return RideEventSerializer(ride.events.filter(created_at__gte=threshold), many=True).data

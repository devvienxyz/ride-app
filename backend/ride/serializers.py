from users.serializers import UserSerializer
from rest_framework import serializers
from .models import Ride, RideEvent


class RideEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideEvent
        fields = "__all__"


class RideSerializer(serializers.ModelSerializer):
    id_rider = UserSerializer()
    id_driver = UserSerializer()
    todays_ride_events = serializers.SerializerMethodField()

    class Meta:
        model = Ride
        fields = "__all__"

    def get_todays_ride_events(self, obj):
        return RideEventSerializer(
            obj.ride_events.filter(created_at__gte=self.context["today_threshold"]), many=True
        ).data

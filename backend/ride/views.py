from django.utils.timezone import now, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from shared.views import AdminLevelModelViewset
from .models import Ride, RideEvent
from .serializers import RideSerializer, RideEventSerializer
from .filters import RideFilter


class RidesViewSet(AdminLevelModelViewset):
    serializer_class = RideSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = RideFilter
    ordering_fields = ["pickup_time", "distance"]

    def get_queryset(self):
        return Ride.objects.all().order_by("pickup_time")

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "today_threshold": now() - timedelta(hours=24)}


class RideEventsViewSet(AdminLevelModelViewset):
    serializer_class = RideEventSerializer
    ordering_fields = ["created_at"]

    def get_queryset(self):
        return RideEvent.objects.all().order_by("created_at")

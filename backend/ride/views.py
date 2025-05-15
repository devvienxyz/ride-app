from django.utils.timezone import now, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from shared.views import AdminLevelReadOnlyModelViewset
from .models import Ride, RideEvent
from .serializers import RideSerializer, RideEventSerializer
from .filters import RideFilter


class RidesViewSet(AdminLevelReadOnlyModelViewset):
    serializer_class = RideSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = RideFilter
    ordering_fields = ["pickup_time", "distance"]

    def get_queryset(self):
        return Ride.objects.all()

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "today_threshold": now() - timedelta(hours=24)}


class RideEventsViewSet(AdminLevelReadOnlyModelViewset):
    serializer_class = RideEventSerializer

    def get_queryset(self):
        return RideEvent.objects.all()

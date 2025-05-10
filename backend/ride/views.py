from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from django.utils.timezone import now, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.db.models import Prefetch
from .models import Ride, RideEvent
from .serializers import RideSerializer, RideEventSerializer
from .filters import RideFilter


class RidesViewSet(ReadOnlyModelViewSet):
    serializer_class = RideSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = RideFilter
    ordering_fields = ["pickup_time", "distance"]

    def get_queryset(self):
        today_threshold = now() - timedelta(hours=24)
        return Ride.objects.select_related("id_rider", "id_driver").prefetch_related(
            Prefetch(
                "ride_events",
                queryset=Ride.ride_events.related.related_model.objects.filter(created_at__gte=today_threshold),
            )
        )

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "today_threshold": now() - timedelta(hours=24)}


class RideEventsViewSet(ModelViewSet):
    queryset = RideEvent.objects.all()
    serializer_class = RideEventSerializer

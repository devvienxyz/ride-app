from django.utils.timezone import now, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F, Func, ExpressionWrapper, FloatField
from django.db.models.functions import Sqrt, Power
from rest_framework.filters import OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from shared.views import AdminLevelModelViewset
from .models import Ride
from .serializers import RideSerializer, RideEventSerializer
from .filters import RideFilter


class RidesViewSet(AdminLevelModelViewset):
    serializer_class = RideSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = RideFilter
    ordering_fields = ["pickup_time", "distance", "id_ride"]
    search_fields = ["status", "id_rider__email"]

    def get_queryset(self):
        qs = (
            Ride.objects.select_related("id_rider", "id_driver")
            .only(
                "status",
                "pickup_latitude",
                "pickup_longitude",
                "pickup_time",
                "dropoff_latitude",
                "dropoff_longitude",
                # "id_rider__id_user",
                "id_rider__email",
                "id_rider__phone_number",
                # "id_driver__id_user",
                "id_driver__email",
                "id_driver__phone_number",
            )
            .order_by("id_ride")
        )

        lat = self.request.query_params.get("lat")
        lon = self.request.query_params.get("lon")
        if lat and lon:
            try:
                lat, lon = float(lat), float(lon)
                distance_expr = ExpressionWrapper(
                    Sqrt(Power(F("pickup_latitude") - lat, 2) + Power(F("pickup_longitude") - lon, 2)),
                    output_field=FloatField(),
                )
                qs = qs.annotate(distance=distance_expr)
            except ValueError:
                pass

        return qs

    def get_serializer_context(self):
        return {
            **super().get_serializer_context(),
            "today_threshold": now() - timedelta(hours=24),
        }

    @action(detail=True, methods=["get"])
    def events(self, request, pk=None):
        """
        Endpoint to get all ride events for a specific ride.
        """
        try:
            ride = self.get_object()  # Get the specific ride instance
            events = ride.ride_events.all()  # Access the related RideEvents
            serializer = RideEventSerializer(events, many=True)
            return Response(serializer.data)
        except Ride.DoesNotExist:
            return Response({"detail": "Ride not found."}, status=404)

from django.utils.timezone import now, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F, ExpressionWrapper, FloatField
from django.db.models.functions import Sqrt, Power
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from shared.views import AdminLevelModelViewset, CreateOrDestroyModelViewset
from .models import Ride, RideEvent
from .serializers import RideSerializer, RideEventSerializer
from .filters import RideFilter


class RidesViewSet(AdminLevelModelViewset):
    serializer_class = RideSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = RideFilter
    ordering_fields = ["pickup_time", "distance_to_pickup", "id_ride"]
    search_fields = ["status", "id_rider__email"]

    def base_queryset(self):
        # prioritize earliest pickups first -- earliest needed to dispatch
        return Ride.objects.select_related("id_rider", "id_driver").order_by("pickup_time", "-id_ride")

    def annotate_distance_to_pickup(self, qs):
        lat = self.request.query_params.get("lat")
        lon = self.request.query_params.get("lon")
        sort = self.request.query_params.get("sort", "pickup_time")

        if lat is None or lon is None:
            return qs

        try:
            lat, lon = float(lat), float(lon)
        except ValueError:
            return qs

        # add rough bounding box filter to reduce records
        lat_range = 0.1
        lon_range = 0.1
        qs = qs.filter(
            pickup_latitude__gte=lat - lat_range,
            pickup_latitude__lte=lat + lat_range,
            pickup_longitude__gte=lon - lon_range,
            pickup_longitude__lte=lon + lon_range,
        )

        # simplified Euclidean formula
        distance_to_pickup_expr = ExpressionWrapper(
            Sqrt(Power(F("pickup_latitude") - lat, 2) + Power(F("pickup_longitude") - lon, 2)),
            output_field=FloatField(),
        )

        qs = qs.annotate(distance_to_pickup=distance_to_pickup_expr)

        if sort == "distance_to_pickup":
            qs = qs.order_by("distance_to_pickup")
        else:
            qs = qs.order_by("pickup_time")

        return qs

    def get_queryset(self):
        qs = self.base_queryset()
        qs = self.annotate_distance_to_pickup(qs)
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


class RideEventCreateOrDeleteView(CreateOrDestroyModelViewset):
    queryset = RideEvent.objects.all()
    serializer_class = RideEventSerializer

    def perform_create(self, serializer):
        id_ride = self.request.data.get("id_ride")

        if not id_ride:
            raise PermissionDenied("Missing ride ID.")

        try:
            ride = Ride.objects.get(id_ride=id_ride)
        except Ride.DoesNotExist:
            raise NotFound("Ride not found.")

        serializer.save(ride=ride)

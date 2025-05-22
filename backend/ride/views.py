from django.utils.timezone import now, timedelta
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import F, ExpressionWrapper, FloatField
from django.db.models.functions import Sqrt, Power
from rest_framework.filters import SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from shared.views import AdminLevelModelViewset, CreateOrDestroyModelViewset
from .models import Ride, RideEvent
from .serializers import RideSerializer, RideEventSerializer
from .filters import RideFilter


class RidesViewSet(AdminLevelModelViewset):
    serializer_class = RideSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = RideFilter
    search_fields = ["status", "id_rider__email"]

    def base_queryset(self):
        return Ride.objects.select_related("id_rider", "id_driver")

    def _get_lat_lon_params(self):
        # Parses and validates 'lat' and 'lon' query parameters.
        # Returns (lat, lon) as floats if valid, otherwise (None, None).
        lat_param = self.request.query_params.get("lat")
        lon_param = self.request.query_params.get("lon")

        if lat_param is None or lon_param is None:
            return None, None

        try:
            lat = float(lat_param)
            lon = float(lon_param)
            return lat, lon
        except ValueError:
            return None, None

    def _apply_bounding_box_filter(self, qs, lat, lon):
        # Applies a rough bounding box filter to the queryset based on
        # given latitude and longitude
        lat_range = 0.1
        lon_range = 0.1
        return qs.filter(
            pickup_latitude__gte=lat - lat_range,
            pickup_latitude__lte=lat + lat_range,
            pickup_longitude__gte=lon - lon_range,
            pickup_longitude__lte=lon + lon_range,
        )

    def _annotate_pickup_distance(self, qs, lat, lon):
        # Annotates the queryset with 'distance_to_pickup' using Euclidean distance
        distance_to_pickup_expr = ExpressionWrapper(
            Sqrt(Power(F("pickup_latitude") - lat, 2) + Power(F("pickup_longitude") - lon, 2)),
            output_field=FloatField(),
        )
        return qs.annotate(distance_to_pickup=distance_to_pickup_expr)

    def _apply_sorting(self, qs, allowed_sort_fields):
        # Validates and applies sorting based on the 'sort' query parameter.
        # Defaults to 'pickup_time' if no valid sort fields are specified
        sort_param = self.request.query_params.get("sort", "pickup_time").strip()
        sort_fields_requested = sort_param.split(",")
        validated_sort_fields = []

        for field in sort_fields_requested:
            field_name_without_prefix = field.lstrip("-")
            if field_name_without_prefix in allowed_sort_fields:
                validated_sort_fields.append(field)

        if not validated_sort_fields:
            validated_sort_fields = ["pickup_time"]

        return qs.order_by(*validated_sort_fields)

    def annotate_distance_to_pickup(self, qs):
        # Orchestrates the process of annotating distance and applying sorting.
        lat, lon = self._get_lat_lon_params()

        # Initialize allowed sort fields; 'distance_to_pickup' is added conditionally
        allowed_sort_fields = {"pickup_time"}

        if lat is not None and lon is not None:
            # Apply bounding box filter and annotate distance
            qs = self._apply_bounding_box_filter(qs, lat, lon)
            qs = self._annotate_pickup_distance(qs, lat, lon)
            allowed_sort_fields.add("distance_to_pickup")  # Add only if annotated

        # Apply sorting based on validated fields
        qs = self._apply_sorting(qs, allowed_sort_fields)

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
        # Endpoint to get all ride events for a specific ride.
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

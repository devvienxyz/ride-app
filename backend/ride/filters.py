from django_filters import CharFilter, BooleanFilter, FilterSet
from django.db.models import F, Func, FloatField, ExpressionWrapper
from .models import Ride


class RideFilter(FilterSet):
    status = CharFilter(field_name="status", lookup_expr="icontains")
    rider_email = CharFilter(field_name="id_rider__email", lookup_expr="icontains")
    sort_by_distance_to_pickup = BooleanFilter(method="filter_distance_to_pickup")

    class Meta:
        model = Ride
        fields = ["status", "rider_email"]

    def filter_distance_to_pickup(self, queryset, name, value):
        if value:
            lat = float(self.request.query_params.get("lat"))
            lng = float(self.request.query_params.get("lng"))
            distance_to_pickup_expr = ExpressionWrapper(
                Func(F("pickup_latitude") - lat, F("pickup_longitude") - lng, function="SQRT(POW(%s, 2) + POW(%s, 2))"),
                output_field=FloatField(),
            )
            return queryset.annotate(distance_to_pickup=distance_to_pickup_expr).order_by("distance_to_pickup")
        return queryset

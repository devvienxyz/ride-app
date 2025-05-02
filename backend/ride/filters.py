from django_filters import CharFilter, BooleanFilter, FilterSet
from .models import Ride
from django.db.models import F, Func, FloatField, ExpressionWrapper


class RideFilter(FilterSet):
    status = CharFilter(field_name="status")
    rider_email = CharFilter(field_name="id_rider__email")
    sort_by_distance = BooleanFilter(method="filter_distance")

    class Meta:
        model = Ride
        fields = ["status", "rider_email"]

    def filter_distance(self, queryset, name, value):
        if value:
            lat = float(self.request.query_params.get("lat"))
            lng = float(self.request.query_params.get("lng"))
            distance_expr = ExpressionWrapper(
                Func(F("pickup_latitude") - lat, F("pickup_longitude") - lng, function="SQRT(POW(%s, 2) + POW(%s, 2))"),
                output_field=FloatField(),
            )
            return queryset.annotate(distance=distance_expr).order_by("distance")
        return queryset

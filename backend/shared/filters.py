from django_filters import BaseInFilter, CharFilter


class CharInFilter(BaseInFilter, CharFilter):
    # expects list query param value
    # ?status=dropoff,pickup
    pass

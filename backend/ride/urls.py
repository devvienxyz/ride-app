from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RidesViewSet, RideEventsViewSet

router = DefaultRouter()
router.register(r"rides", RidesViewSet, basename="rides")
router.register(r"ride-events", RideEventsViewSet, basename="ride_events")

urlpatterns = [
    path("", include(router.urls)),
]

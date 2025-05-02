from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RideViewSet, RideEventViewSet

router = DefaultRouter()
router.register(r"rides", RideViewSet)
router.register(r"ride-events", RideEventViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

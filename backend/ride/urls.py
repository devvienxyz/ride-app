from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RideViewSet

router = DefaultRouter()
router.register(r"rides", RideViewSet, basename="ride")

urlpatterns = [
    path("", include(router.urls)),
]

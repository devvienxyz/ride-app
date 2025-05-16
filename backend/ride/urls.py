from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RidesViewSet

router = DefaultRouter()
router.register(r"rides", RidesViewSet, basename="rides")

urlpatterns = [
    path("", include(router.urls)),
]

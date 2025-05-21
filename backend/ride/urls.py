from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RidesViewSet, RideEventCreateOrDeleteView

router = DefaultRouter()
router.register(r"rides", RidesViewSet, basename="rides")

urlpatterns = [
    path(
        "ride-events/",
        RideEventCreateOrDeleteView.as_view({"post": "create", "delete": "destroy"}),
        name="ride-event-create-or-destroy",
    ),
    path("", include(router.urls)),
]

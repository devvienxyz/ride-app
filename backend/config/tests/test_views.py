from rest_framework import status
from django.urls import reverse


def test_healthcheck_accessible_to_all(client):
    """Test if the healthcheck endpoint is accessible to everyone (public)."""
    url = reverse("health_check")
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK

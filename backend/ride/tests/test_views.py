from rest_framework import status
from django.urls import reverse


def test_rides_accessible_to_admin_only(client, create_regular_user, create_superuser):
    """Test if the rides endpoint is accessible only to admins or superusers."""
    rides_url = reverse("rides")

    # Regular user tries to access rides endpoint
    client.login(username="user", password="password")
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_403_FORBIDDEN  # Forbidden for non-admin users

    # Superuser tries to access rides endpoint
    client.login(username="admin", password="password")
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_200_OK  # Allowed for superuser


def test_ride_events_accessible_to_admin_only(client, create_regular_user, create_superuser):
    """Test if the rides endpoint is accessible only to admins or superusers."""
    rides_url = reverse("ride-events")

    # Regular user tries to access rides endpoint
    client.login(username="user", password="password")
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_403_FORBIDDEN  # Forbidden for non-admin users

    # Superuser tries to access rides endpoint
    client.login(username="admin", password="password")
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_200_OK  # Allowed for superuser

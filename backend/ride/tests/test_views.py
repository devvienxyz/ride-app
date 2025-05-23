import pytest
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
@pytest.mark.admin_level_only_view
def test_rides_accessible_to_admin_only(client, create_regular_user, create_superuser):
    """Test if the rides endpoint is accessible only to admins or superusers."""
    rides_url = reverse("rides-list")

    # Regular user tries to access rides endpoint
    client.force_authenticate(user=create_regular_user)
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_403_FORBIDDEN  # Forbidden for non-admin users

    # Superuser tries to access rides endpoint
    client.force_authenticate(user=create_superuser)
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_200_OK  # Allowed for superuser


@pytest.mark.skip(reason="Temporarily remmoved ride events api")
@pytest.mark.django_db
@pytest.mark.admin_level_only_view
def test_ride_events_accessible_to_admin_only(client, create_regular_user, create_superuser):
    """Test if the rides endpoint is accessible only to admins or superusers."""
    rides_url = reverse("ride_events-list")

    # Regular user tries to access rides endpoint
    client.force_authenticate(user=create_regular_user)
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_403_FORBIDDEN  # Forbidden for non-admin users

    # Superuser tries to access rides endpoint
    client.force_authenticate(user=create_superuser)
    response = client.get(rides_url)
    assert response.status_code == status.HTTP_200_OK  # Allowed for superuser

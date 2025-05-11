import pytest
from rest_framework.test import APIRequestFactory
from shared.permissions import IsAdminOrSuperuser


@pytest.mark.django_db
def test_is_admin_or_superuser_handles_attribute_error():
    factory = APIRequestFactory()
    request = factory.get("/fake-url/")

    # Simulate a broken user object (missing attributes)
    request.user = object()  # Generic object with no attributes

    permission = IsAdminOrSuperuser()
    result = permission.has_permission(request, view=None)

    assert result is False

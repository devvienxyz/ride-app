import django
import pytest
import os
from django.contrib.auth import get_user_model

# Ensure the settings module is properly configured for tests
os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.test"
django.setup()  # Ensure Django is set up before accessing models


@pytest.fixture
def create_superuser():
    """Fixture to create a superuser"""
    return get_user_model().objects.create_superuser(
        email="admin@example.com", password="password", first_name="Admin", last_name="User", phone_number="1234567890"
    )


@pytest.fixture
def create_regular_user():
    """Fixture to create a regular user"""
    return get_user_model().objects.create_user(
        email="user@example.com",
        password="password",
        first_name="John",
        last_name="Doe",
        phone_number="0987654321",
        role="rider",
    )


@pytest.fixture
def client():
    """Fixture to get a test client"""
    from rest_framework.test import APIClient

    return APIClient()

import django
import os
import pytest
from django.contrib.auth import get_user_model


# Ensure the settings module is properly configured for tests
os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings.test"  # Adjust this to your test settings module
django.setup()  # Ensure Django is set up before accessing models


@pytest.fixture
def create_superuser():
    """Fixture to create a superuser"""
    return get_user_model().objects.create_superuser(username="admin", password="password")


@pytest.fixture
def create_regular_user():
    """Fixture to create a regular user"""
    return get_user_model().objects.create_user(username="user", password="password")


@pytest.fixture
def client():
    """Fixture to get a test client"""
    from rest_framework.test import APIClient

    return APIClient()

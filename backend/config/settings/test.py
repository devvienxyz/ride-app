import os
from .development import *  # noqa: F401, F403

DEBUG = True
ALLOWED_HOSTS = []  # No need for domain names in testing

TEST_DB_USER = os.getenv("TEST_DB_USER")
TEST_DB_PASSWORD = os.getenv("TEST_DB_PASSWORD")

assert TEST_DB_USER is not None
assert TEST_DB_PASSWORD is not None

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ride_app_db",
        "USER": TEST_DB_USER,
        "PASSWORD": TEST_DB_PASSWORD,
        "HOST": "localhost",
        "PORT": "5432",
    }
}

LOGGING_CONFIG = None

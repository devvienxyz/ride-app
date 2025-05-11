import os
from .development import *  # noqa: F401, F403

DEBUG = True
ALLOWED_HOSTS = []  # No need for domain names in testing

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "ride_app_db",
        "USER": os.getenv("POSTGRES_USER"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": "localhost",
        "PORT": "5432",
        "TEST": {
            "NAME": "test_ride_app_db",  # explicit
        },
    }
}

LOGGING_CONFIG = None

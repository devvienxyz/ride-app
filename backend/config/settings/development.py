from .base import *

DEBUG = True
RUNSERVERPLUS_SERVER_ADDRESS_PORT = "0.0.0.0:8000"
MODE = "development"

INSTALLED_APPS += [
    "django_extensions",
]

INTERNAL_IPS = ["127.0.0.1", "localhost", "0.0.0.0"]
ALLOWED_HOSTS = INTERNAL_IPS + []

from .base import *

DEBUG = True

INSTALLED_APPS += [
    "django_extensions",
]

INTERNAL_IPS = ["127.0.0.1"]
RUNSERVERPLUS_SERVER_ADDRESS_PORT = "0.0.0.0:8000"

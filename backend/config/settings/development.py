from .base import *

DEBUG = True
RUNSERVERPLUS_SERVER_ADDRESS_PORT = "0.0.0.0:8000"
MODE = "development"

INSTALLED_APPS += [
    "django_extensions",
    "drf_spectacular",
]

INTERNAL_IPS = ["127.0.0.1", "localhost", "0.0.0.0"]
ALLOWED_HOSTS = INTERNAL_IPS + []

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Ride App",
    "DESCRIPTION": "API documentation for development",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
    "rest_framework.renderers.JSONRenderer",  # Allow UI in other environments
    "rest_framework.renderers.BrowsableAPIRenderer",
]

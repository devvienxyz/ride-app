from .base import *  # noqa: F401, F403
from .base import INSTALLED_APPS, REST_FRAMEWORK, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS, SIMPLE_JWT

DEBUG = True
COOKIE_SECURE = False
RUNSERVERPLUS_SERVER_ADDRESS_PORT = "0.0.0.0:8000"
MODE = "development"

INSTALLED_APPS += [
    "django_extensions",
    "drf_spectacular",
]

INTERNAL_IPS = ["127.0.0.1", "localhost", "0.0.0.0"]
ALLOWED_HOSTS += INTERNAL_IPS
CORS_ALLOWED_ORIGINS += ["http://localhost:5173"]
SIMPLE_JWT["AUTH_SECURE_COOKIE"] = False

SPECTACULAR_SETTINGS = {
    "TITLE": "Ride App",
    "DESCRIPTION": "API documentation for development",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

REST_FRAMEWORK["DEFAULT_SCHEMA_CLASS"] = "drf_spectacular.openapi.AutoSchema"
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
    "rest_framework.renderers.JSONRenderer",  # Allow UI in other environments
    "rest_framework.renderers.BrowsableAPIRenderer",
]

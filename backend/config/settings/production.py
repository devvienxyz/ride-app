from .base import *  # noqa: F401, F403
from .base import SIMPLE_JWT, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS

DEBUG = False
MODE = "production"
COOKIE_SECURE = True
ALLOWED_HOSTS += []
SIMPLE_JWT["AUTH_SECURE_COOKIE"] = True
CORS_ALLOWED_ORIGINS += []

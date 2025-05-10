from . import development as development_settings  # noqa: F401

DEBUG = True
ALLOWED_HOSTS = []  # No need for domain names in testing
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "test_db",  # Test database
        "USER": "postgres",
        "PASSWORD": "password",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

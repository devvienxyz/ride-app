from django.contrib.auth.hashers import make_password


def hash_password(raw_password: str) -> str:
    return make_password(raw_password)

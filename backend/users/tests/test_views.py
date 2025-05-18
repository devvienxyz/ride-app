import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_login_success(client, create_regular_user):
    url = reverse("login")
    resp = client.post(url, {"email": create_regular_user.email, "password": "password"}, format="json")
    assert resp.status_code == 200
    assert set(resp.data.keys()) == {"first_name"}

    # Check if cookies are set
    cookies = resp.cookies
    assert "access_token" in cookies
    assert "refresh_token" in cookies

    # Assert cookie properties
    access_cookie = cookies["access_token"]
    assert access_cookie["httponly"]
    assert access_cookie["samesite"] == "Strict"


@pytest.mark.django_db
def test_login_invalid_credentials(client):
    url = reverse("login")
    resp = client.post(url, {"email": "wrong@example.com", "password": "wrongpass"}, format="json")
    assert resp.status_code == 401
    assert "access" not in resp.data
    assert "Invalid credentials." == str(resp.data["detail"])


def test_login_missing_fields(client):
    url = reverse("login")
    resp = client.post(url, {"email": ""}, format="json")
    assert resp.status_code == 400

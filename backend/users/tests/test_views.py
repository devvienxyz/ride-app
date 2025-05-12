import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_login_success(client, create_regular_user):
    url = reverse("token_obtain_pair")
    resp = client.post(url, {"email": create_regular_user.email, "password": "password"}, format="json")
    assert resp.status_code == 200
    assert "access" in resp.data
    assert "refresh" in resp.data
    assert resp.data["email"] == create_regular_user.email


@pytest.mark.django_db
def test_login_invalid_credentials(client):
    url = reverse("token_obtain_pair")
    resp = client.post(url, {"email": "wrong@example.com", "password": "wrongpass"}, format="json")
    assert resp.status_code == 401
    assert "access" not in resp.data
    assert "Invalid email or password."  == str(resp.data["detail"])

def test_login_missing_fields(client):
    url = reverse("token_obtain_pair")
    resp = client.post(url, {"email": ""}, format="json")
    assert resp.status_code == 400

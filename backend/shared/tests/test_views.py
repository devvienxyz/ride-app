from rest_framework.test import APIRequestFactory
from shared.views import PublicView


def test_public_view_response_direct():
    factory = APIRequestFactory()
    request = factory.get("/fake-public-url/")
    view = PublicView.as_view()

    response = view(request)

    assert response.status_code == 200
    assert response.data == {"message": "This is a public view!"}

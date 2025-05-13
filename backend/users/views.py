from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import status
from shared.views import PublicView


class LoginView(PublicView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            res = Response({"first_name": user.first_name}, status=status.HTTP_200_OK)
            # Set tokens in cookies
            res.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Strict",
                max_age=15 * 60,
            )
            res.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Strict",
                max_age=7 * 24 * 60 * 60,
            )
            return res
        return Response({"detail": "Invalid credentials"}, status=401)


class LogoutView(PublicView):
    def post(self, request):
        response = Response({"message": "Logged out"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response

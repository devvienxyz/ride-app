from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework import status
from shared.views import PublicView


class CookieTokenRefreshView(PublicView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"detail": "No refresh token provided."}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            res = Response({"detail": "Access token refreshed."}, status=200)
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=settings.COOKIE_SECURE,
                samesite="Strict",
                max_age=15 * 60,
            )
            return res
        except TokenError:
            return Response({"detail": "Invalid refresh token."}, status=401)


class LoginView(PublicView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"detail": "Invalid credentials."}, status=401)


class LogoutView(PublicView):
    def post(self, request):
        response = Response({"message": "Logged out"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response

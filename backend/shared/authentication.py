from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Read token from cookie instead of header
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            print("No access token in cookies!")
            return None

        try:
            validated_token = self.get_validated_token(access_token)
        except Exception as e:
            print(f"Token validation failed: {e}")
            return None

        return self.get_user(validated_token), validated_token

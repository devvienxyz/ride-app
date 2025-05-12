from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "invalid_credentials": _("Invalid email or password."),
    }

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            return data
        except AuthenticationFailed:
            raise AuthenticationFailed(self.error_messages["invalid_credentials"])


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

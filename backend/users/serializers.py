from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from rest_framework import serializers
from users.models import User


@extend_schema_serializer(
    examples=[OpenApiExample("User example", value={"id_user": 1, "first_name": "johndoe", "email": "john@example.com"})]
)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id_user", "role", "first_name", "last_name", "email", "phone_number"]

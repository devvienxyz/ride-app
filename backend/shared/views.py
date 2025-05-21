from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from shared.permissions import IsAdminOrSuperuser
from shared.authentication import CookieJWTAuthentication


class PublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "This is a public view!"})


class AdminLevelView(APIView):
    permission_classes = [IsAdminOrSuperuser]
    authentication_classes = [CookieJWTAuthentication]


class AdminLevelModelViewset(ModelViewSet):
    permission_classes = [IsAdminOrSuperuser]
    authentication_classes = [CookieJWTAuthentication]


class CreateOrDestroyModelViewset(CreateModelMixin, DestroyModelMixin, GenericViewSet):
    permission_classes = [IsAdminOrSuperuser]
    authentication_classes = [CookieJWTAuthentication]

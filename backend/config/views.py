from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from shared.views import PublicView


class HealthCheckView(PublicView):
    @extend_schema(responses={200: {"description": "API is up and running"}})
    def get(self, request):
        """
        Health check endpoint to confirm that the API is running.
        """
        return Response({"status": "OK"}, status=200)

from rest_framework.permissions import BasePermission


class IsAdminOrSuperuser(BasePermission):
    """
    Custom permission to only allow admin users or superusers.
    """

    def has_permission(self, request, view):
        try:
            return request.user and (request.user.is_staff or request.user.is_superuser)
        except AttributeError:
            return False

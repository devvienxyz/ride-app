from rest_framework import permissions


class IsAdminOrSuperuser(permissions.BasePermission):
    """
    Custom permission to only allow admin users or superusers.
    """

    def has_permission(self, request, view):
        return request.user and (request.user.is_admin or request.user.is_superuser)

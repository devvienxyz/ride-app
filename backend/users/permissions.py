class IsAdminUserCustom:
    def has_permission(self, request, view):
        return request.user and request.user.role == "admin"

from rest_framework import permissions


class IsPremiumOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        return (request.method in permissions.SAFE_METHODS) or \
               (request.user and request.user.is_authenticated and request.user.is_premium_user)


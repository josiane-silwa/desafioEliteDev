from rest_framework import permissions

class IsOrganizador(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "organizador")
 
 
class IsPortariaUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "portaria")
 
 
class IsOwnerOrOrganizador(permissions.BasePermission):
    """Permite acesso ao dono do objeto (cliente) ou ao organizador responsável."""
 
    def has_object_permission(self, request, view, obj):
        user = request.user
        if getattr(obj, "cliente_id", None) == user.id:
            return True
        if getattr(obj, "evento", None) and obj.evento.organizador_id == user.id:
            return True
        return False
 

from rest_framework import permissions, viewsets
from .permissions import IsOrganizador, IsOwnerOrOrganizador, IsPortariaUser
from rest_framework.decorators import action
from rest_framework.response import Response
from ..services import compartilhamento_ingresso
from ..models import Assento
from ..serializers.assento import AssentoSerializer

class AssentoViewSet(viewsets.ModelViewSet):
    queryset = Assento.objects.select_related("evento").all()
    serializer_class = AssentoSerializer
    filterset_fields = ["evento"]
 
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticatedOrReadOnly()]
        return [permissions.IsAuthenticated(), IsOrganizador()]
 
    def get_queryset(self):
        qs = super().get_queryset()
        if self.action in ["update", "partial_update", "destroy", "create"]:
            user = self.request.user
            if user.is_authenticated and user.role == "organizador":
                return qs.filter(evento__organizador=user)
        return qs

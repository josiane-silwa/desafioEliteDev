from rest_framework import viewsets, permissions
from .permissions import IsOrganizador, IsOwnerOrOrganizador, IsPortariaUser
from ..models import Portaria
from ..serializers.portaria import PortariaSerializer

# Create your views here.
class PortariaViewSet(viewsets.ModelViewSet):
    queryset = Portaria.objects.select_related("usuario").all()
    serializer_class = PortariaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrganizador]

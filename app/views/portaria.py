from rest_framework import viewsets, permissions
from ..models import Portaria
from ..serializers import PortariaSerializer

# Create your views here.
class PortariaViewSet(viewsets.ModelViewSet):
    queryset = Portaria.objects.select_related("usuario").all()
    serializer_class = PortariaSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsOrganizador]

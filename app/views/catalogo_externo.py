from rest_framework import permissions, viewsets
from ..models import CatalogoExterno
from ..serializers.catalogo_externo import CatalogoExternoSerializer

class CatalogoExternoViewSet(viewsets.ModelViewSet):
    queryset = CatalogoExterno.objects.all()
    serializer_class = CatalogoExternoSerializer
    filterset_fields = ["provider", "categoria"]
    search_fields = ["titulo", "descricao"]
 
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticatedOrReadOnly()]
        return [permissions.IsAuthenticated(), permissions.IsOrganizador()]

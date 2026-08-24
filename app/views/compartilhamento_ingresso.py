from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..services import compartilhamento_ingresso
from ..models import CompartilhamentoIngresso
from ..serializers.compartilhamento_ingresso import CompartilhamentoIngressoSerializer

class CompartilhamentoIngressoViewSet(viewsets.ModelViewSet):
    queryset = CompartilhamentoIngresso.objects.select_related("ingresso").all()
    serializer_class = CompartilhamentoIngressoSerializer
    permission_classes = [permissions.IsAuthenticated]
 
    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(ingresso__reserva__cliente=self.request.user)
 
    @action(detail=True, methods=["post"])
    def revogar(self, request, pk=None):
        compartilhamento = self.get_object()
        compartilhamento = services.compartilhamento_revogar(compartilhamento)
        return Response(CompartilhamentoIngressoSerializer(compartilhamento).data)

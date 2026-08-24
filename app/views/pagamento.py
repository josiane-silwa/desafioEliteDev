from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from ..models import Pagamento
from ..serializers import PagamentoSerializer

class PagamentoViewSet(viewsets.ModelViewSet):
    queryset = Pagamento.objects.select_related("reserva").all()
    serializer_class = PagamentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status", "metodo", "reserva"]
 
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.role == "cliente":
            return qs.filter(reserva__cliente=user)
        if user.role == "organizador":
            return qs.filter(reserva__evento__organizador=user)
        return qs
 
    @action(detail=True, methods=["post"])
    def aprovar(self, request, pk=None):
        pagamento = self.get_object()
        pagamento = services.pagamento_aprovar(pagamento)
        return Response(PagamentoSerializer(pagamento).data)
 
    @action(detail=True, methods=["post"])
    def recusar(self, request, pk=None):
        pagamento = self.get_object()
        pagamento = services.pagamento_recusar(pagamento)

        return Response(PagamentoSerializer(pagamento).data)

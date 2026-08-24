from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from ..models import Ingresso
from ..serializers import IngressoSerializer, IngressoDetailSerializer


class IngressoViewSet(viewsets.ModelViewSet):
    queryset = Ingresso.objects.select_related("reserva", "reserva__cliente", "reserva__evento").all()
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status", "reserva"]
    http_method_names = ["get", "post", "head", "options"]
 
    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return IngressoDetailSerializer
        return IngressoSerializer
 
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.role == "cliente":
            return qs.filter(reserva__cliente=user)
        if user.role == "organizador":
            return qs.filter(reserva__evento__organizador=user)
        return qs
 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
 
        ingresso = services.ingresso_emitir(serializer.validated_data["reserva"])
        output = IngressoDetailSerializer(ingresso)
        return Response(output.data, status=status.HTTP_201_CREATED)
 
    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        ingresso = self.get_object()
        ingresso = services.ingresso_cancelar(ingresso)
        return Response(IngressoDetailSerializer(ingresso).data)

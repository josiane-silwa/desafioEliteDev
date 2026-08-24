from rest_framework import viewsets, permissions
from .permissions import IsOrganizador, IsOwnerOrOrganizador, IsPortariaUser
from rest_framework.decorators import action
from ..models import Reserva
from ..serializers.reserva import ReservaSerializer, ReservaDetailSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.select_related("cliente", "evento", "assento").all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrOrganizador]
    filterset_fields = ["status", "evento"]
 
    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ReservaDetailSerializer
        return ReservaSerializer
 
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.role == "cliente":
            return qs.filter(cliente=user)
        if user.role == "organizador":
            return qs.filter(evento__organizador=user)
        return qs
 
    def create(self, request, *args, **kwargs):
        # a criação de reserva possui regra de negócio (assento livre,
        # evento publicado, assento pertence ao evento) — contida no
        # service; a view só valida a forma do payload e traduz o
        # resultado do domínio em resposta HTTP.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
 
        reserva = services.reserva_criar(
            cliente=request.user,
            evento=serializer.validated_data["evento"],
            assento=serializer.validated_data["assento"],
            valor=serializer.validated_data.get("valor"),
        )
        output = ReservaDetailSerializer(reserva)
        return Response(output.data, status=status.HTTP_201_CREATED)
 
    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        reserva = self.get_object()
        reserva = services.reserva_cancelar(reserva, request.user)
        return Response(ReservaDetailSerializer(reserva).data)


from rest_framework import permissions, viewsets
from .permissions import IsOrganizador, IsOwnerOrOrganizador, IsPortariaUser
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Evento
from ..serializers.evento import EventoSerializer, EventoDetailSerializer


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.select_related("organizador", "catalogo").all()
    filterset_fields = ["status", "tipo", "cidade", "estado"]
    search_fields = ["titulo", "descricao"]
 
    def get_serializer_class(self):
        if self.action in ["retrieve", "list"]:
            return EventoDetailSerializer
        return EventoSerializer
 
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticatedOrReadOnly()]
        return [permissions.IsAuthenticated(), IsOrganizador()]
 
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if self.action in ["update", "partial_update", "destroy"]:
            return qs.filter(organizador=user)
        if self.action in ["list", "retrieve"] and user.is_authenticated and user.role == "organizador":
            return qs
        if self.action in ["list", "retrieve"]:
            return qs.filter(status="publicado")
        return qs
 
    def perform_create(self, serializer):
        # ligar o organizador ao usuário logado é integridade simples,
        # não é "regra de negócio" no sentido de decisão condicional —
        # por isso fica na view, e não no service.
        serializer.save(organizador=self.request.user)
 
    @action(detail=True, methods=["post"])
    def publicar(self, request, pk=None):
        evento = self.get_object()
        evento = services.evento_publicar(evento, request.user)
        
        return Response(EventoDetailSerializer(evento).data)
 
    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        evento = self.get_object()
        evento = services.evento_cancelar(evento, request.user)
        
        return Response(EventoDetailSerializer(evento).data)
 

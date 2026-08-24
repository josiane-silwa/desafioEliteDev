from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (UserViewSet, 
                    ReservaViewSet, 
                    EventoViewSet,
                    IngressoViewSet,
                    PagamentoViewSet,
                    PortariaViewSet,
                    AssentoViewSet,
                    CompartilhamentoIngressoViewSet,
                    ValidacaoIngressoViewSet,
                    CatalogoExternoViewSet) 

router = DefaultRouter()

router.register(r"usuarios", UserViewSet, basename='usuario')
router.register(r"reservas", ReservaViewSet, basename='reserva')
router.register(r"eventos", EventoViewSet, basename='evento')
router.register(r"ingressos", IngressoViewSet, basename='ingresso')
router.register(r"pagamentos", PagamentoViewSet, basename='pagamento')
router.register(r"assentos", AssentoViewSet, basename='assento')
router.register(r"compartilhamentos_ingresso", CompartilhamentoIngressoViewSet, basename='compartilhamento')
router.register(r"catalogo_externo", CatalogoExternoViewSet, basename='catalogo')
router.register(r"validacoes_ingresso", ValidacaoIngressoViewSet, basename='validacao')
router.register(r"portaria", PortariaViewSet, basename='portaria')

app_name = "eventos"

urlpatterns = [
    path('', include(router.urls)),
]
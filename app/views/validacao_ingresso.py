from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..services import validacao_ingresso
from ..models import ValidacaoIngresso
from ..serializers import ValidacaoIngressoSerializer


class ValidacaoIngressoViewSet(viewsets.ModelViewSet):
    queryset = ValidacaoIngresso.objects.select_related("ingresso", "portaria").all()
    serializer_class = ValidacaoIngressoSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsPortariaUser]
    http_method_names = ["get", "post", "head", "options"]
 
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
 
        validacao = services.ingresso_validar(
            ingresso=serializer.validated_data["ingresso"],
            usuario_portaria=request.user,
            ip=request.META.get("REMOTE_ADDR"),
        )
        output = self.get_serializer(validacao)
        return Response(output.data, status=status.HTTP_201_CREATED)
 
    @action(detail=False, methods=["post"], url_path="validar-por-codigo")
    def validar_por_codigo(self, request):
        codigo = request.data.get("codigo")
        if not codigo:
            return Response(
                {"detail": "Informe o código do ingresso."},
                status=status.HTTP_400_BAD_REQUEST,
            )
 
        validacao = validacao_ingresso.ingresso_validar_por_codigo(
            codigo=codigo,
            usuario_portaria=request.user,
            ip=request.META.get("REMOTE_ADDR"),
        )
        return Response(
            self.get_serializer(validacao).data,
            status=status.HTTP_201_CREATED,
        )

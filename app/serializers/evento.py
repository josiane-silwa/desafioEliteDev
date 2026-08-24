from rest_framework import serializers
from .catalogo_externo import CatalogoExterno, CatalogoExternoSerializer
#from catalogo_externo import CatalogoExterno
from .assento import AssentoSerializer
from .usuario import UserSerializer, User
from ..models import Evento


class EventoSerializer(serializers.ModelSerializer):

    organizador = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="organizador"),
    )
    catalogo = serializers.PrimaryKeyRelatedField(
        queryset=CatalogoExterno.objects.all(),
    )
    vagas_disponiveis = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        #fields = "__all__"
        fields = [
            "id",
            "organizador",
            "catalogo",
            "titulo",
            "descricao",
            "tipo",
            "status",
            "data_inicio",
            "data_fim",
            "preco",
            "capacidade",
            "local",
            "endereco",
            "numero",
            "complemento",
            "bairro",
            "cidade",
            "estado",
            "cep",
            "vagas_disponiveis",
            "criado_em",
            "atualizado_em",
        ]
        
        read_only_fields = ["id", "criado_em", "atualizado_em"]

    def get_vagas_disponiveis(self, obj):
        ocupados = obj.reservas.filter(status__in=["pendente", "confirmada"]).count()
        return max(obj.capacidade - ocupados, 0)
 
    def validate(self, attrs):
        data_inicio = attrs.get("data_inicio") or getattr(self.instance, "data_inicio", None)
        data_fim = attrs.get("data_fim") or getattr(self.instance, "data_fim", None)
        if data_inicio and data_fim and data_fim <= data_inicio:
            raise serializers.ValidationError(
                {"data_fim": "A data de término deve ser posterior à data de início."}
            )
        return attrs

 
class EventoDetailSerializer(EventoSerializer):
    """Versão com dados aninhados para telas de detalhe."""
 
    organizador = UserSerializer(read_only=True)
    catalogo = CatalogoExternoSerializer(read_only=True)
    assentos = AssentoSerializer(many=True, read_only=True)
 
    class Meta(EventoSerializer.Meta):
        fields = EventoSerializer.Meta.fields + ["assentos"]

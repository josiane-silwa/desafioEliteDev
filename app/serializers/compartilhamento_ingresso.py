from rest_framework import serializers
from django.utils import timezone
from ..models import CompartilhamentoIngresso


class CompartilhamentoIngressoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompartilhamentoIngresso
        #fields = "__all__"
        fields = [
            "id",
            "ingresso",
            "token",
            "ativo",
            "criado_em",
            "expira_em",
        ]
        read_only_fields = ["id", "token", "criado_em"]
 
    def validate(self, attrs):
        expira_em = attrs.get("expira_em")
        if expira_em and expira_em <= timezone.now():
            raise serializers.ValidationError(
                {"expira_em": "A data de expiração deve estar no futuro."}
            )
        return attrs

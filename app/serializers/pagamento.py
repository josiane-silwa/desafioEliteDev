from rest_framework import serializers
from django.utils import timezone
from ..models import Pagamento


class PagamentoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pagamento
        #fields = "__all__"
        fields = [
            "id",
            "reserva",
            "valor",
            "status",
            "metodo",
            "transacao_id",
            "criado_em",
            "pago_em",
            "atualizado_em",
        ]
        
        read_only_fields = ["id", "transacao_id", "criado_em", "atualizado_em"]

    def validate_reserva(self, value):
        if hasattr(value, "pagamento") and not self.instance:
            raise serializers.ValidationError("Esta reserva já possui um pagamento associado.")
        return value
 
    def validate(self, attrs):
        status = attrs.get("status") or getattr(self.instance, "status", None)
        if status == "aprovado" and not attrs.get("pago_em"):
            attrs["pago_em"] = timezone.now()
        return attrs

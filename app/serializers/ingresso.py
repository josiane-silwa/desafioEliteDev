from rest_framework import serializers
from .reserva import ReservaDetailSerializer
from ..models import Ingresso


class IngressoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingresso
        #fields = "__all__"
        fields = [
            "id",
            "reserva",
            "codigo",
            "token",
            "status",
            "criado_em",
            "utilizado_em",
        ]
        
        read_only_fields = ["id", "codigo", "token", "criado_em", "utilizado_em"]

    def validate_reserva(self, value):
        if value.status != "confirmada":
            raise serializers.ValidationError(
                "Só é possível emitir ingresso para uma reserva confirmada."
            )
        if hasattr(value, "ingresso") and not self.instance:
            raise serializers.ValidationError("Esta reserva já possui um ingresso emitido.")
        return value

 
class IngressoDetailSerializer(IngressoSerializer):
    reserva = ReservaDetailSerializer(read_only=True)

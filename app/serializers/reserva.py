
from rest_framework import serializers
from usuario import User, UserSerializer
from assento import AssentoSerializer
from evento import EventoSerializer
from ..models import Reserva


class ReservaSerializer(serializers.ModelSerializer):

    cliente = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="cliente"),
    )

    class Meta:
        model = Reserva
        #fields = "__all__"
        fields = [
            "id",
            "cliente",
            "evento",
            "assento",
            "status",
            "valor",
            "criado_em",
            "expira_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "status", "criado_em", "atualizado_em"]

    def validate(self, attrs):
        evento = attrs.get("evento") or getattr(self.instance, "evento", None)
        assento = attrs.get("assento") or getattr(self.instance, "assento", None)
 
        if assento and evento and assento.evento_id != evento.id:
            raise serializers.ValidationError(
                {"assento": "Este assento não pertence ao evento informado."}
            )
 
        if assento:
            qs = Reserva.objects.filter(
                assento=assento,
                status__in=["pendente", "confirmada"],
            )
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {"assento": "Este assento já possui uma reserva ativa."}
                )
 
        if evento and evento.status != "publicado":
            raise serializers.ValidationError(
                {"evento": "Só é possível reservar assentos de eventos publicados."}
            )
 
        return attrs

class ReservaDetailSerializer(ReservaSerializer):
    cliente = UserSerializer(read_only=True)
    evento = EventoSerializer(read_only=True)
    assento = AssentoSerializer(read_only=True)

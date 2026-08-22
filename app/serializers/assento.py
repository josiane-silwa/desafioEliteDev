from rest_framework import serializers

from ..models import Assento


class AssentoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Assento
        #fields = "__all__"
        fields = [
            "id",
            "evento",
            "codigo",
            "fila",
            "numero",
            "criado_em",
        ]

        read_only_fields = [
            "id",
            "criado_em",
        ]
        
    def get_disponivel(self, obj):
        return not obj.reservas.filter(status__in=["pendente", "confirmada"]).exists()
 
    def validate(self, attrs):
        evento = attrs.get("evento") or getattr(self.instance, "evento", None)
        codigo = attrs.get("codigo") or getattr(self.instance, "codigo", None)
        qs = Assento.objects.filter(evento=evento, codigo=codigo)
        
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Já existe um assento com esse código para este evento.")
        
        return attrs

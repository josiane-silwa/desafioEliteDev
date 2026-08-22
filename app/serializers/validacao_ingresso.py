from rest_framework import serializers
from django.utils import timezone
from ..models import ValidacaoIngresso


class ValidacaoIngressoSerializer(serializers.ModelSerializer):
    # ingresso_codigo = serializers.UUIDField(
    #     source="ingresso.codigo",
    #     read_only=True,
    # )

    # portaria_nome = serializers.CharField(
    #     source="portaria.usuario.get_full_name",
    #     read_only=True,
    # )

    # class Meta:
    #     model = ValidacaoIngresso

    #     fields = [
    #         "id",
    #         "ingresso",
    #         "ingresso_codigo",
    #         "portaria",
    #         "portaria_nome",
    #         "validado_em",
    #         "ip",
    #     ]

    #     read_only_fields = [
    #         "id",
    #         "validado_em",
    #     ]
        
    class Meta:
        model = ValidacaoIngresso
        #fields = "__all__"
        fields = ["id", "ingresso", "portaria", "validado_em", "ip"]
        read_only_fields = ["id", "validado_em"]
 
    def validate_ingresso(self, value):
        if value.status == "utilizado":
            raise serializers.ValidationError("Este ingresso já foi utilizado.")
        if value.status == "cancelado":
            raise serializers.ValidationError("Este ingresso está cancelado e não pode ser validado.")
        return value
 
    def create(self, validated_data):
        validacao = super().create(validated_data)
        ingresso = validacao.ingresso
        ingresso.status = "utilizado"
        ingresso.utilizado_em = timezone.now()
        ingresso.save(update_fields=["status", "utilizado_em"])
        return validacao

from rest_framework import serializers

from ..models import CatalogoExterno


class CatalogoExternoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CatalogoExterno
        #fields = "__all__"
        fields = [
            "id",
            "provider",
            "external_id",
            "titulo",
            "descricao",
            "imagem_url",
            "categoria",
            "data_origem",
            "dados_json",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_em", "atualizado_em"]

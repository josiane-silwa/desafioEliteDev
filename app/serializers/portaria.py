from rest_framework import serializers
from usuario import User
from ..models import Portaria


class PortariaSerializer(serializers.ModelSerializer):

    # usuario_nome = serializers.CharField(
    #     source="usuario.get_full_name",
    #     read_only=True,
    # )

    # usuario_email = serializers.EmailField(
    #     source="usuario.email",
    #     read_only=True,
    # )

    # class Meta:
    #     model = Portaria

    #     fields = [
    #         "id",
    #         "usuario",
    #         "usuario_nome",
    #         "usuario_email",
    #         "ativo",
    #         "criado_em",
    #     ]

    #     read_only_fields = [
    #         "id",
    #         "criado_em",
    #     ]
        
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="portaria"),
    )

    class Meta:
        model = Portaria
        #fields = "__all__"
        fields = ["id", "usuario", "ativo", "criado_em"]
        
        read_only_fields = ["id", "criado_em"]

    
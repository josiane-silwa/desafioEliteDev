from rest_framework import serializers

from ..models import CompartilhamentoIngresso


class CompartilhamentoIngressoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CompartilhamentoIngresso
        fields = "__all__"
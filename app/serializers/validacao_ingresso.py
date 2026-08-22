from rest_framework import serializers

from ..models import ValidacaoIngresso


class ValidacaoIngressoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ValidacaoIngresso
        fields = "__all__"
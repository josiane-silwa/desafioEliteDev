from rest_framework import serializers

from ..models import Ingressos


class IngressosSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingressos
        fields = "__all__"
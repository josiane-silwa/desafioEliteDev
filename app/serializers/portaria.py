from rest_framework import serializers

from ..models import Portaria


class PortariaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Portaria
        fields = "__all__"
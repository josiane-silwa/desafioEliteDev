from rest_framework import serializers

from ..models import CatalogoExterno


class CatalogoExternoSerializer(serializers.ModelSerializer):

    class Meta:
        model = CatalogoExterno
        fields = "__all__"
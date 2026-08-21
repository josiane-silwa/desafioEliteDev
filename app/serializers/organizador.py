from rest_framework import serializers

from ..models import Organizador


class OrganizadorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Organizador
        fields = "__all__"
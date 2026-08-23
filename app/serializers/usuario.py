from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from ..models import User

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        #fields = "__all__"
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "cpf",
            "celular",
            "data_nascimento",
            "criado_em",
            "atualizado_em",
        ]

        read_only_fields = [
            "id",
            "criado_em",
            "atualizado_em",
        ]
        

class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer dedicado ao cadastro, com senha e confirmação."""
 
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        #style={"input_type": "password"},
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        #style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "cpf",
            "celular",
            "data_nascimento",
            "password",
            "password2",
        ]
    def validate_cpf(self, value):
            if not value.isdigit() or len(value) != 11:
                raise serializers.ValidationError("CPF deve conter exatamente 11 dígitos numéricos.")
            return value
        
    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password2": "As senhas não coincidem."})
        return attrs
 
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        return user

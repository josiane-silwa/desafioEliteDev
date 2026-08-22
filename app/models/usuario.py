import uuid
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ("organizador", "Organizador"),
        ("cliente", "Cliente"),
        ("portaria", "Portaria"),
    ]

    email = models.EmailField(
        unique=True,
        verbose_name="E-mail",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        verbose_name="Perfil",
    )

    cpf = models.CharField(
        max_length=11,
        unique=True,
        verbose_name="CPF",
    )

    celular = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Celular",
    )

    data_nascimento = models.DateField(
        null=True,
        blank=True,
        verbose_name="Data de nascimento",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.get_full_name() or self.username

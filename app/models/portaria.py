import uuid
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

class Portaria(models.Model):

    usuario = models.OneToOneField(
        "app.User",
        on_delete=models.CASCADE,
        related_name="portaria",
        limit_choices_to={"role": "portaria"},
        verbose_name="Usuário",
    )

    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.usuario.get_full_name()

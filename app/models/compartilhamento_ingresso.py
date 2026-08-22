import uuid
#from django.contrib.auth.models import AbstractUser
#from django.core.validators import MinValueValidator
from django.db import models

class CompartilhamentoIngresso(models.Model):
    ingresso = models.ForeignKey(
        "Ingresso",
        on_delete=models.CASCADE,
        related_name="compartilhamentos",
        verbose_name="Ingresso",
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name="Token",
    )

    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    expira_em = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Expira em",
    )

    def __str__(self):
        return str(self.token)
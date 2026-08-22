import uuid
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models

class ValidacaoIngresso(models.Model):

    ingresso = models.OneToOneField(
        "Ingresso",
        on_delete=models.PROTECT,
        related_name="validacao",
        verbose_name="Ingresso",
    )

    portaria = models.ForeignKey(
        "Portaria",
        on_delete=models.PROTECT,
        related_name="validacoes",
        verbose_name="Portaria",
    )

    validado_em = models.DateTimeField(
        auto_now_add=True,
    )

    ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="IP",
    )

    def __str__(self):
        return f"Validação #{self.id}"

import uuid
from django.conf import settings
from django.db import models

STATUS_CHOICES = [
    ("ativo", "Ativo"),
    ("cancelado", "Cancelado"),
    ("utilizado", "Utilizado"),
]

class Ingresso(models.Model):

    STATUS_CHOICES = [
        ("ativo", "Ativo"),
        ("cancelado", "Cancelado"),
        ("utilizado", "Utilizado"),
    ]

    reserva = models.OneToOneField(
        "Reserva",
        on_delete=models.PROTECT,
        related_name="ingresso",
        verbose_name="Reserva",
    )

    codigo = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name="Código",
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name="Token",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="ativo",
        verbose_name="Status",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    utilizado_em = models.DateTimeField(
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"Ingresso #{self.id}"
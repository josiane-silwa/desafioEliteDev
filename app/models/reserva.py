import uuid
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models

class Reserva(models.Model):

    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ("confirmada", "Confirmada"),
        ("cancelada", "Cancelada"),
        ("expirada", "Expirada"),
    ]

    cliente = models.ForeignKey(
        "app.User",
        on_delete=models.PROTECT,
        related_name="reservas",
        limit_choices_to={"role": "cliente"},
        verbose_name="Cliente",
    )

    evento = models.ForeignKey(
        "Evento",
        on_delete=models.PROTECT,
        related_name="reservas",
        verbose_name="Evento",
    )

    assento = models.ForeignKey(
        "Assento",
        on_delete=models.PROTECT,
        related_name="reservas",
        verbose_name="Assento",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pendente",
        verbose_name="Status",
    )

    valor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ],
        verbose_name="Valor",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    expira_em = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Expira em",
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=["evento", "assento"],
                condition=models.Q(
                    status__in=["pendente", "confirmada"]
                ),
                name="unique_active_seat_reservation",
            )
        ]

        ordering = ["-criado_em"]

    def __str__(self):
        return f"Reserva #{self.id}"

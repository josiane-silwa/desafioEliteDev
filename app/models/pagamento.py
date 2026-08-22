import uuid
#from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models

class Pagamento(models.Model):

    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ("aprovado", "Aprovado"),
        ("recusado", "Recusado"),
        ("cancelado", "Cancelado"),
    ]

    METODO_CHOICES = [
        ("simulado", "Pagamento simulado"),
        ("cartao", "Cartão"),
        ("pix", "PIX"),
    ]

    reserva = models.OneToOneField(
        "Reserva",
        on_delete=models.PROTECT,
        related_name="pagamento",
        verbose_name="Reserva",
    )

    valor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ],
        verbose_name="Valor",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pendente",
        verbose_name="Status",
    )

    metodo = models.CharField(
        max_length=20,
        choices=METODO_CHOICES,
        default="simulado",
        verbose_name="Método",
    )

    transacao_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name="ID da transação",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    pago_em = models.DateTimeField(
        null=True,
        blank=True,
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return str(self.transacao_id)
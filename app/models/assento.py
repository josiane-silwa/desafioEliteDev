#from django.contrib.auth.models import AbstractUser
#from django.core.validators import MinValueValidator
from django.db import models

class Assento(models.Model):

    evento = models.ForeignKey(
        "Evento",
        on_delete=models.CASCADE,
        related_name="assentos",
        verbose_name="Evento",
    )

    codigo = models.CharField(
        max_length=20,
        verbose_name="Código",
    )

    fila = models.CharField(
        max_length=10,
        blank=True,
        verbose_name="Fila",
    )

    numero = models.PositiveIntegerField(
        verbose_name="Número",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=["evento", "codigo"],
                name="unique_seat_per_event",
            )
        ]

        ordering = ["fila", "numero"]

    def __str__(self):
        return f"{self.evento.titulo} - {self.codigo}"


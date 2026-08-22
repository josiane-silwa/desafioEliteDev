#import uuid
#from django.contrib.auth.models import AbstractUser
#from django.core.validators import MinValueValidator
from django.db import models

class CatalogoExterno(models.Model):

    PROVIDER_CHOICES = [
        ("ticketmaster", "Ticketmaster"),
        ("tmdb", "TMDb"),
    ]

    provider = models.CharField(
        max_length=20,
        choices=PROVIDER_CHOICES,
        verbose_name="Provedor",
    )

    external_id = models.CharField(
        max_length=100,
        verbose_name="ID externo",
    )

    titulo = models.CharField(
        max_length=255,
        verbose_name="Título",
    )

    descricao = models.TextField(
        blank=True,
        verbose_name="Descrição",
    )

    imagem_url = models.URLField(
        blank=True,
        verbose_name="Imagem",
    )

    categoria = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Categoria",
    )

    data_origem = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Data original",
    )

    dados_json = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Dados da API",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        verbose_name = "Item do catálogo externo"
        verbose_name_plural = "Itens do catálogo externo"

        constraints = [
            models.UniqueConstraint(
                fields=["provider", "external_id"],
                name="unique_provider_external_id",
            )
        ]

    def __str__(self):
        return self.titulo

    
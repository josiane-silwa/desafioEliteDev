#import uuid
#from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models

TIPO_CHOICES = [
    ("presencial", "Presencial"),
    ("online", "Online"),
    ("digital", "Conteúdo Digital"),
]

STATUS_CHOICES = [
    ("rascunho", "Rascunho"),
    ("publicado", "Publicado"),
    ("cancelado", "Cancelado"),
    ("encerrado", "Encerrado"),
]

class Evento(models.Model):
    organizador = models.ForeignKey(
        "app.User",
        on_delete=models.PROTECT,
        related_name="eventos",
        limit_choices_to={"role": "organizador"},
        verbose_name="Organizador",
    )

    catalogo = models.ForeignKey(
        "CatalogoExterno",
        on_delete=models.PROTECT,
        related_name="eventos",
        verbose_name="Item do catálogo",
    )

    titulo = models.CharField(
        max_length=255,
        verbose_name="Título",
    )

    descricao = models.TextField(
        blank=True,
        verbose_name="Descrição",
    )

    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        default="presencial",
        verbose_name="Tipo",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="rascunho",
        verbose_name="Status",
    )

    data_inicio = models.DateTimeField(
        verbose_name="Data de início",
    )

    data_fim = models.DateTimeField(
        verbose_name="Data de término",
    )

    preco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ],
        verbose_name="Preço",
    )

    capacidade = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1)
        ],
        verbose_name="Capacidade",
    )

    local = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Local",
    )

    endereco = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Endereço",
    )

    numero = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Número",
    )

    complemento = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Complemento",
    )

    bairro = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Bairro",
    )

    cidade = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Cidade",
    )

    estado = models.CharField(
        max_length=2,
        blank=True,
        verbose_name="UF",
    )

    cep = models.CharField(
        max_length=9,
        blank=True,
        verbose_name="CEP",
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["data_inicio"]

    def __str__(self):
        return self.titulo


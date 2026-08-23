from django.contrib import admin
from .models import User, CatalogoExterno, Assento, Evento, Reserva, Pagamento, Ingresso, Portaria, ValidacaoIngresso, CompartilhamentoIngresso


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "first_name",
        "last_name",
        "email",
        "role",
        "cpf",
        "celular",
        "data_nascimento",
        "criado_em",
        "atualizado_em",
    )

@admin.register(CatalogoExterno)
class CatalogoExternoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "provider",
        "external_id",
        "titulo",
        "descricao",
        "imagem_url",
        "categoria",
        "data_origem",
        "dados_json",
        "criado_em",
        "atualizado_em",
    )
    
@admin.register(Assento)
class AssentoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "evento",
        "codigo",
        "fila",
        "numero",
        "criado_em",
    )
    
@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "organizador",
        "catalogo",
        "titulo",
        "descricao",
        "tipo",
        "status",
        "data_inicio",
        "data_fim",
        "preco",
        "capacidade",
        "local",
        "endereco",
        "numero",
        "complemento",
        "bairro",
        "cidade",
        "estado",
        "cep",
        "criado_em",
        "atualizado_em",
    )
    
@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cliente",
        "evento",
        "assento",
        "status",
        "criado_em",
        "expira_em",
        "atualizado_em",
    )
    
@admin.register(Pagamento)
class PagamentoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "reserva",
        "valor",
        "status",
        "metodo",
        "criado_em",
        "pago_em",
        "atualizado_em",
    )
    
@admin.register(Ingresso)
class IngressoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "reserva",
        "codigo",
        "token",
        "status",
        "criado_em",
        "utilizado_em",
    )
    
@admin.register(Portaria)
class PortariaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario",
        "ativo",
        "criado_em",
    )
    
@admin.register(ValidacaoIngresso)
class ValidacaoIngressoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ingresso",
        "portaria",
        "validado_em",
        "ip",
    )
    
@admin.register(CompartilhamentoIngresso)
class CompartilhamentoIngressoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "ingresso",
        "token",
        "ativo",
        "criado_em",
        "expira_em",
    )

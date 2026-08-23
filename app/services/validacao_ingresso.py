from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
 
from ..models import Ingresso, Portaria, ValidacaoIngresso


@transaction.atomic
def ingresso_validar(*, ingresso: Ingresso, usuario_portaria, ip: str | None = None):
    #from .models import ValidacaoIngresso  # import local evita ciclo com o topo do módulo
 
    if ingresso.status == "utilizado":
        raise ValidationError("Este ingresso já foi utilizado.")
    if ingresso.status == "cancelado":
        raise ValidationError("Este ingresso está cancelado e não pode ser validado.")
 
    try:
        portaria = Portaria.objects.get(usuario=usuario_portaria)
    except Portaria.DoesNotExist:
        raise PermissionDenied("Usuário não está vinculado a uma portaria ativa.")
 
    if not portaria.ativo:
        raise PermissionDenied("Esta portaria está inativa.")
 
    validacao = ValidacaoIngresso.objects.create(
        ingresso=ingresso,
        portaria=portaria,
        ip=ip,
    )
 
    ingresso.status = "utilizado"
    ingresso.utilizado_em = timezone.now()
    ingresso.save(update_fields=["status", "utilizado_em"])
 
    return validacao
 
 
def ingresso_validar_por_codigo(*, codigo, usuario_portaria, ip: str | None = None):
    try:
        ingresso = Ingresso.objects.select_related("reserva").get(codigo=codigo)
    except Ingresso.DoesNotExist:
        raise NotFound("Ingresso não encontrado.")
 
    return ingresso_validar(ingresso=ingresso, usuario_portaria=usuario_portaria, ip=ip)

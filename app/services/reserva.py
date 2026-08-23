from rest_framework.exceptions import PermissionDenied, ValidationError
 
from ..models import Reserva

def reserva_criar(*, cliente, evento, assento, valor=None) -> Reserva:
    if evento.status != "publicado":
        raise ValidationError({"evento": "Só é possível reservar assentos de eventos publicados."})
 
    if assento.evento_id != evento.id:
        raise ValidationError({"assento": "Este assento não pertence ao evento informado."})
 
    if Reserva.objects.filter(
        assento=assento, status__in=["pendente", "confirmada"]
    ).exists():
        raise ValidationError({"assento": "Este assento já possui uma reserva ativa."})
 
    return Reserva.objects.create(
        cliente=cliente,
        evento=evento,
        assento=assento,
        status="pendente",
        valor=valor if valor is not None else evento.preco,
    )
 
 
def reserva_cancelar(reserva: Reserva, usuario) -> Reserva:
    eh_dono = reserva.cliente_id == usuario.id
    eh_organizador = reserva.evento.organizador_id == usuario.id
    if not (eh_dono or eh_organizador):
        raise PermissionDenied("Você não tem permissão para cancelar esta reserva.")
 
    if reserva.status not in ["pendente", "confirmada"]:
        raise ValidationError({"status": "Esta reserva não pode mais ser cancelada."})
 
    reserva.status = "cancelada"
    reserva.save(update_fields=["status"])
    return reserva

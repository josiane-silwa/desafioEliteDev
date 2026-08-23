from rest_framework.exceptions import ValidationError
 
from ..models import Ingresso, Reserva

def ingresso_emitir(reserva: Reserva) -> Ingresso:
    if reserva.status != "confirmada":
        raise ValidationError("Só é possível emitir ingresso para uma reserva confirmada.")
 
    if hasattr(reserva, "ingresso"):
        raise ValidationError("Esta reserva já possui um ingresso emitido.")
 
    return Ingresso.objects.create(reserva=reserva)
 
 
def ingresso_cancelar(ingresso: Ingresso) -> Ingresso:
    if ingresso.status != "ativo":
        raise ValidationError({"status": "Somente ingressos ativos podem ser cancelados."})
 
    ingresso.status = "cancelado"
    ingresso.save(update_fields=["status"])
    return ingresso

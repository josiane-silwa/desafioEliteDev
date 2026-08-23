from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
 
from ..models import Pagamento

@transaction.atomic
def pagamento_aprovar(pagamento: Pagamento) -> Pagamento:
    if pagamento.status != "pendente":
        raise ValidationError({"status": "Somente pagamentos pendentes podem ser aprovados."})
 
    pagamento.status = "aprovado"
    pagamento.pago_em = timezone.now()
    pagamento.save(update_fields=["status", "pago_em"])
 
    # aprovar o pagamento confirma a reserva associada — regra de negócio
    # que atravessa duas tabelas, por isso está no service e não no
    # serializer de Pagamento nem no de Reserva.
    reserva = pagamento.reserva
    reserva.status = "confirmada"
    reserva.save(update_fields=["status"])
 
    return pagamento
 
 
def pagamento_recusar(pagamento: Pagamento) -> Pagamento:
    if pagamento.status != "pendente":
        raise ValidationError({"status": "Somente pagamentos pendentes podem ser recusados."})
 
    pagamento.status = "recusado"
    pagamento.save(update_fields=["status"])
    return pagamento

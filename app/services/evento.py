from rest_framework.exceptions import PermissionDenied, ValidationError
from ..models import Evento
 
def evento_publicar(evento: Evento, usuario) -> Evento:
    if evento.organizador_id != usuario.id:
        raise PermissionDenied("Você não é o organizador deste evento.")
 
    if evento.status not in ["rascunho"]:
        raise ValidationError({"status": "Só é possível publicar eventos em rascunho."})
 
    evento.status = "publicado"
    evento.save(update_fields=["status"])
    
    return evento
 
 
def evento_cancelar(evento: Evento, usuario) -> Evento:
    if evento.organizador_id != usuario.id:
        raise PermissionDenied("Você não é o organizador deste evento.")
 
    if evento.status == "cancelado":
        raise ValidationError({"status": "Este evento já está cancelado."})
    if evento.status == "encerrado":
        raise ValidationError({"status": "Não é possível cancelar um evento já encerrado."})
 
    evento.status = "cancelado"
    evento.save(update_fields=["status"])
    
    return evento

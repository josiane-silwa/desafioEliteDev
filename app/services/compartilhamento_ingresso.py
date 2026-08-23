from rest_framework.exceptions import ValidationError
 
from ..models import CompartilhamentoIngresso

def compartilhamento_revogar(compartilhamento) -> "CompartilhamentoIngresso":
    if not compartilhamento.ativo:
        raise ValidationError({"ativo": "Este compartilhamento já está revogado."})
 
    compartilhamento.ativo = False
    compartilhamento.save(update_fields=["ativo"])
    
    return compartilhamento

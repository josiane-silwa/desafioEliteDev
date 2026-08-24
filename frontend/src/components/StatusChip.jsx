import Chip from "@mui/material/Chip";

const MAPA = {
  // Evento
  rascunho: { label: "Rascunho", color: "default" },
  publicado: { label: "Publicado", color: "success" },
  cancelado: { label: "Cancelado", color: "error" },
  encerrado: { label: "Encerrado", color: "default" },
  // Reserva / Pagamento
  pendente: { label: "Pendente", color: "warning" },
  confirmada: { label: "Confirmada", color: "success" },
  aprovado: { label: "Aprovado", color: "success" },
  recusado: { label: "Recusado", color: "error" },
  expirada: { label: "Expirada", color: "default" },
  // Ingresso
  ativo: { label: "Ativo", color: "success" },
  utilizado: { label: "Utilizado", color: "default" },
};

export default function StatusChip({ status, size = "small" }) {
  const info = MAPA[status] || { label: status, color: "default" };
  return <Chip label={info.label} color={info.color} size={size} />;
}

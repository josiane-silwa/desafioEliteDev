import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";

import { buscarEvento } from "../../api/eventos";
import { formatarDataHora, formatarPreco } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function EventoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { autenticado, isCliente } = useAuth();
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarEvento(id)
      .then(setEvento)
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <Box>
        <Skeleton variant="rounded" height={40} width={280} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  if (!evento) {
    return <Typography>Evento não encontrado.</Typography>;
  }

  // Convenção usada na criação dos assentos: eventos com mapa (cinema/
  // teatro) têm `fila` preenchida; eventos de pista têm assentos
  // anônimos com código "PISTA-xxxx" e `fila` vazia — ver AssentoFormPage
  // no fluxo do organizador.
  const temMapaDeAssentos = (evento.assentos || []).some((a) => a.fila);
  const ehPista = !temMapaDeAssentos && (evento.assentos || []).length > 0;

  function iniciarReserva() {
    if (!autenticado) {
      navigate("/entrar", { state: { proximaRota: `/eventos/${id}` } });
      return;
    }
    if (temMapaDeAssentos) {
      navigate(`/eventos/${id}/assentos`);
    } else {
      navigate(`/eventos/${id}/quantidade`);
    }
  }

  return (
    <Box>
      <Chip
        label={evento.tipo === "online" ? "Online" : evento.tipo === "digital" ? "Conteúdo digital" : "Presencial"}
        size="small"
        sx={{ mb: 1.5 }}
      />
      <Typography variant="h3" component="h1" gutterBottom>
        {evento.titulo}
      </Typography>

      <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <CalendarMonthOutlinedIcon color="action" />
          <Typography variant="body1">{formatarDataHora(evento.data_inicio)}</Typography>
        </Box>
        {evento.local && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <PlaceOutlinedIcon color="action" />
            <Typography variant="body1">
              {evento.local}
              {evento.cidade ? ` — ${evento.cidade}/${evento.estado}` : ""}
            </Typography>
          </Box>
        )}
        {(temMapaDeAssentos || ehPista) && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <EventSeatOutlinedIcon color="action" />
            <Typography variant="body1">
              {temMapaDeAssentos ? "Lugar marcado" : "Ingresso de pista"}
            </Typography>
          </Box>
        )}
      </Stack>

      <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
        {evento.descricao || "Sem descrição adicional para este evento."}
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              A partir de
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>
              {formatarPreco(evento.preco)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {evento.vagas_disponiveis} vaga(s) disponível(is)
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            disabled={evento.vagas_disponiveis === 0 || (!isCliente && autenticado)}
            onClick={iniciarReserva}
          >
            {evento.vagas_disponiveis === 0 ? "Esgotado" : "Selecionar ingresso"}
          </Button>
        </Stack>
        {!isCliente && autenticado && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Apenas contas de cliente podem reservar ingressos.
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}

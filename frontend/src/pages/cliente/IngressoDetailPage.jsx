import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import { QRCodeSVG } from "qrcode.react";

import { buscarIngresso } from "../../api/ingressos";
import StatusChip from "../../components/StatusChip";
import { formatarDataHora } from "../../utils/formatters";
import { cores } from "../../theme";

export default function IngressoDetailPage() {
  const { id } = useParams();
  const [ingresso, setIngresso] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarIngresso(id)
      .then(setIngresso)
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return <Skeleton variant="rounded" height={420} />;
  }
  if (!ingresso) {
    return <Typography>Ingresso não encontrado.</Typography>;
  }

  const evento = ingresso.reserva?.evento;
  const assento = ingresso.reserva?.assento;

  return (
    <Box maxWidth={480} mx="auto">
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 4, overflow: "hidden" }}
      >
        <Box sx={{ p: 3, backgroundColor: cores.tinta, color: "#fff" }}>
          <StatusChip status={ingresso.status} />
          <Typography variant="h5" sx={{ mt: 1 }}>
            {evento?.titulo || "Evento"}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            {evento?.data_inicio && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2">{formatarDataHora(evento.data_inicio)}</Typography>
              </Stack>
            )}
            {evento?.local && (
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {evento.local}
                  {evento.cidade ? ` — ${evento.cidade}` : ""}
                </Typography>
              </Stack>
            )}
            {assento && (
              <Stack direction="row" spacing={1} alignItems="center">
                <EventSeatOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {assento.fila ? `Fila ${assento.fila}, assento ${assento.numero}` : `Ingresso ${assento.codigo}`}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Divider
            sx={{
              borderStyle: "dashed",
              borderColor: cores.linhaTracejada,
              mb: 3,
            }}
          />

          <Stack alignItems="center" spacing={2}>
            <Box sx={{ p: 2, border: `1px solid ${cores.linhaTracejada}`, borderRadius: 2 }}>
              <QRCodeSVG value={ingresso.codigo} size={180} />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: '"IBM Plex Mono", monospace', letterSpacing: "0.03em", textAlign: "center" }}
            >
              {ingresso.codigo}
            </Typography>
            <Typography variant="caption" color="text.secondary" align="center">
              Não consegue mostrar a tela na entrada? Informe este código para a portaria digitar
              manualmente.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

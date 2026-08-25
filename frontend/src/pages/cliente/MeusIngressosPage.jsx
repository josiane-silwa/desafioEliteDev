import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import ButtonBase from "@mui/material/ButtonBase";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";

import { listarMeusIngressos } from "../../api/ingressos";
import TicketStub from "../../components/TicketStub";
import StatusChip from "../../components/StatusChip";
import { formatarDataHora } from "../../utils/formatters";

export default function MeusIngressosPage() {
  const navigate = useNavigate();
  const [ingressos, setIngressos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarMeusIngressos()
      .then((data) => setIngressos(Array.isArray(data) ? data : data.results || []))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Meus ingressos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Apresente o código em QR na entrada do evento.
      </Typography>

      <Stack spacing={2}>
        {carregando &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={130} />)}

        {!carregando && ingressos.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" gutterBottom>
              Você ainda não tem ingressos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assim que você concluir uma compra, seus ingressos aparecem aqui.
            </Typography>
          </Box>
        )}

        {!carregando &&
          ingressos.map((ingresso) => (
            <ButtonBase
              key={ingresso.id}
              onClick={() => navigate(`/meus_ingressos/${ingresso.id}`)}
              sx={{ display: "block", width: "100%", textAlign: "left", borderRadius: 3 }}
            >
              <TicketStub
                minHeight={110}
                stub={<QrCode2OutlinedIcon sx={{ fontSize: 40 }} />}
              >
                <Stack spacing={0.5} height="100%" justifyContent="center">
                  <StatusChip status={ingresso.status} />
                  <Typography variant="h6" component="p">
                    {ingresso.reserva?.evento?.titulo || `Reserva #${ingresso.reserva?.id ?? ""}`}
                  </Typography>
                  {ingresso.reserva?.evento?.data_inicio && (
                    <Typography variant="body2" color="text.secondary">
                      {formatarDataHora(ingresso.reserva.evento.data_inicio)}
                    </Typography>
                  )}
                </Stack>
              </TicketStub>
            </ButtonBase>
          ))}
      </Stack>
    </Box>
  );
}

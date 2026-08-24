import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ButtonBase from "@mui/material/ButtonBase";

import TicketStub from "./TicketStub";
import { formatarData, formatarPreco } from "../utils/formatters";

export default function EventoCard({ evento }) {
  const navigate = useNavigate();

  return (
    <ButtonBase
      onClick={() => navigate(`/eventos/${evento.id}`)}
      sx={{ display: "block", width: "100%", textAlign: "left", borderRadius: 3 }}
    >
      <TicketStub
        minHeight={132}
        stub={
          <>
            <Typography variant="overline" sx={{ opacity: 0.8, lineHeight: 1 }}>
              A partir de
            </Typography>
            <Typography variant="h6" component="p" sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>
              {formatarPreco(evento.preco)}
            </Typography>
          </>
        }
      >
        <Stack spacing={1} height="100%" justifyContent="center">
          <Chip
            label={evento.tipo === "online" ? "Online" : evento.tipo === "digital" ? "Conteúdo digital" : "Presencial"}
            size="small"
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
          />
          <Typography variant="h6" component="h3" noWrap>
            {evento.titulo}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarMonthOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatarData(evento.data_inicio)}
              </Typography>
            </Box>
            {evento.local && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                <PlaceOutlinedIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {evento.local}
                  {evento.cidade ? ` · ${evento.cidade}` : ""}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </TicketStub>
    </ButtonBase>
  );
}

import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import { listarMeusEventos, publicarEvento, cancelarEvento } from "../../api/eventos";
import StatusChip from "../../components/StatusChip";
import { formatarData, formatarPreco } from "../../utils/formatters";

export default function MeusEventosPage() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);

  // A busca da montagem não precisa (e não deve) chamar
  // setCarregando(true): o estado já nasce true via useState(true).
  // Repetir esse setState de forma síncrona dentro do efeito é o que
  // disparava o aviso de "cascading render" — o mesmo padrão do
  // AuthContext. O efeito só faz a parte assíncrona de verdade.
  useEffect(() => {
    listarMeusEventos()
      .then((data) => setEventos(Array.isArray(data) ? data : data.results || []))
      .finally(() => setCarregando(false));
  }, []);

  // Reusada pelos handlers de publicar/cancelar, chamados a partir de
  // um evento de clique — nesse contexto não há problema em setar
  // carregando(true) de novo, porque não estamos dentro do corpo
  // síncrono de um efeito.
  function carregar() {
    setCarregando(true);
    listarMeusEventos()
      .then((data) => setEventos(Array.isArray(data) ? data : data.results || []))
      .finally(() => setCarregando(false));
  }

  async function handlePublicar(id) {
    setProcessandoId(id);
    try {
      await publicarEvento(id);
      carregar();
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleCancelar(id) {
    setProcessandoId(id);
    try {
      await cancelarEvento(id);
      carregar();
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Meus eventos
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/organizador/eventos/novo"
        >
          Criar evento
        </Button>
      </Stack>

      <Stack spacing={2}>
        {carregando &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={90} />)}

        {!carregando && eventos.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" gutterBottom>
              Você ainda não criou nenhum evento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clique em "Criar evento" para publicar o primeiro.
            </Typography>
          </Box>
        )}

        {!carregando &&
          eventos.map((evento) => (
            <Paper
              key={evento.id}
              elevation={0}
              sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <StatusChip status={evento.status} />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {evento.titulo}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {formatarData(evento.data_inicio)} · {formatarPreco(evento.preco)} ·{" "}
                    {evento.vagas_disponiveis} vaga(s)
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="Editar">
                    <IconButton component={RouterLink} to={`/organizador/eventos/${evento.id}`}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                  {evento.status === "rascunho" && (
                    <Tooltip title="Publicar">
                      <IconButton
                        color="success"
                        disabled={processandoId === evento.id}
                        onClick={() => handlePublicar(evento.id)}
                      >
                        <PublishOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {["rascunho", "publicado"].includes(evento.status) && (
                    <Tooltip title="Cancelar evento">
                      <IconButton
                        color="error"
                        disabled={processandoId === evento.id}
                        onClick={() => handleCancelar(evento.id)}
                      >
                        <BlockOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
      </Stack>
    </Box>
  );
}

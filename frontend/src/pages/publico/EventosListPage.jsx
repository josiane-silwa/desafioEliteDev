import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { listarEventosPublicados } from "../../api/eventos";
import EventoCard from "../../components/EventoCard";

const TIPOS = [
  { value: "", label: "Todos os tipos" },
  { value: "presencial", label: "Presencial" },
  { value: "online", label: "Online" },
  { value: "digital", label: "Conteúdo digital" },
];

export default function EventosListPage() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    const params = { status: "publicado" };
    if (busca) params.search = busca;
    if (tipo) params.tipo = tipo;

    const timeoutId = setTimeout(() => {
      listarEventosPublicados(params)
        .then((data) => setEventos(Array.isArray(data) ? data : data.results || []))
        .finally(() => setCarregando(false));
    }, 300); // pequeno debounce pra não disparar 1 request por tecla

    return () => clearTimeout(timeoutId);
  }, [busca, tipo]);

  function handleBuscaChange(e) {
    setCarregando(true);
    setBusca(e.target.value);
  }

  function handleTipoChange(e) {
    setCarregando(true);
    setTipo(e.target.value);
  }

  const listaVazia = !carregando && eventos.length === 0;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Encontre seu próximo evento
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Shows, peças e filmes em cartaz — com data, local e preço, tudo em um só lugar.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Buscar por título, cidade ou casa de show"
          value={busca}
          onChange={handleBuscaChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          value={tipo}
          onChange={handleTipoChange}
          sx={{ minWidth: { sm: 220 } }}
        >
          {TIPOS.map((opcao) => (
            <MenuItem key={opcao.value} value={opcao.value}>
              {opcao.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Grid container spacing={3}>
        {carregando &&
          Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Skeleton variant="rounded" height={132} />
            </Grid>
          ))}

        {!carregando &&
          eventos.map((evento) => (
            <Grid item xs={12} sm={6} key={evento.id}>
              <EventoCard evento={evento} />
            </Grid>
          ))}
      </Grid>

      {listaVazia && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" gutterBottom>
            Nenhum evento encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar a busca ou remover os filtros.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { buscarEvento, listarAssentos } from "../../api/eventos";
import { criarReserva } from "../../api/reservas";
import { extrairMensagemErro } from "../../api/Api";
import { formatarPreco } from "../../utils/formatters";

const MAX_POR_PEDIDO = 6;

export default function SelecaoQuantidadePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [disponiveis, setDisponiveis] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [reservando, setReservando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([buscarEvento(id), listarAssentos(id)])
      .then(([ev, ass]) => {
        setEvento(ev);
        const lista = Array.isArray(ass) ? ass : ass.results || [];
        setDisponiveis(lista.filter((a) => a.disponivel));
      })
      .finally(() => setCarregando(false));
  }, [id]);

  const limite = Math.min(MAX_POR_PEDIDO, disponiveis.length);

  function alterarQuantidade(delta) {
    setQuantidade((atual) => Math.min(limite, Math.max(1, atual + delta)));
  }

  async function confirmar() {
    setReservando(true);
    setErro("");
    try {
      const assentosParaReservar = disponiveis.slice(0, quantidade);
      const reservas = [];
      for (const assento of assentosParaReservar) {
        const reserva = await criarReserva({ evento: Number(id), assento: assento.id });
        reservas.push(reserva.id);
      }
      navigate("/checkout", { state: { reservaIds: reservas } });
    } catch (err) {
      setErro(extrairMensagemErro(err));
      const atualizados = await listarAssentos(id);
      const lista = Array.isArray(atualizados) ? atualizados : atualizados.results || [];
      setDisponiveis(lista.filter((a) => a.disponivel));
    } finally {
      setReservando(false);
    }
  }

  if (carregando) {
    return <Skeleton variant="rounded" height={300} />;
  }

  if (limite === 0) {
    return <Alert severity="warning">Não há ingressos de pista disponíveis para este evento.</Alert>;
  }

  const total = quantidade * Number(evento?.preco || 0);

  return (
    <Box maxWidth={520}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quantos ingressos?
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {evento?.titulo} — ingresso de pista, sem lugar marcado.
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 4, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
          <IconButton
            size="large"
            onClick={() => alterarQuantidade(-1)}
            disabled={quantidade <= 1}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="h2" sx={{ minWidth: 72, textAlign: "center" }}>
            {quantidade}
          </Typography>
          <IconButton
            size="large"
            onClick={() => alterarQuantidade(1)}
            disabled={quantidade >= limite}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <AddIcon />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          {disponiveis.length} ingresso(s) restante(s) · até {limite} por pedido
        </Typography>
      </Paper>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 3 }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Total
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>
            {formatarPreco(total)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={confirmar}
          disabled={reservando}
          startIcon={reservando ? <CircularProgress size={18} /> : null}
        >
          {reservando ? "Reservando..." : "Ir para pagamento"}
        </Button>
      </Stack>
    </Box>
  );
}

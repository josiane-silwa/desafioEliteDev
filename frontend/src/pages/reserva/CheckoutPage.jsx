import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import { buscarReserva, cancelarReserva } from "../../api/reservas";
import { criarPagamento, aprovarPagamento, recusarPagamento } from "../../api/pagamentos";
import { emitirIngresso } from "../../api/ingressos";
import { extrairMensagemErro } from "../../api/Api";
import { formatarPreco } from "../../utils/formatters";

// Etapas do checkout simulado: monta o pedido -> aguarda decisão do
// "gateway" (aqui, escolhida pelo próprio usuário para fins de teste)
// -> resultado final.
export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservaIds = location.state?.reservaIds || [];

  const [reservas, setReservas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  // Já sabemos, antes do primeiro render, se há reservas a carregar
  // (reservaIds vem de location.state, disponível de forma síncrona)
  // — então esse é o valor inicial correto, não algo a decidir dentro
  // do efeito.
  const [carregando, setCarregando] = useState(reservaIds.length > 0);
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null); // "aprovado" | "recusado"
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (reservaIds.length === 0) return; // nada a montar; "carregando" já nasceu false

    async function montarPedido() {
      const reservasCarregadas = await Promise.all(reservaIds.map(buscarReserva));
      setReservas(reservasCarregadas);
      const pagamentosCriados = await Promise.all(
        reservasCarregadas.map((r) => criarPagamento({ reserva: r.id, valor: r.valor }))
      );
      setPagamentos(pagamentosCriados);
      setCarregando(false);
    }
    montarPedido().catch((err) => {
      setErro(extrairMensagemErro(err));
      setCarregando(false);
    });
  }, [reservaIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  async function confirmarPagamento() {
    setProcessando(true);
    setErro("");
    try {
      await Promise.all(pagamentos.map((p) => aprovarPagamento(p.id)));
      await Promise.all(reservas.map((r) => emitirIngresso(r.id)));
      setResultado("aprovado");
    } catch (err) {
      setErro(extrairMensagemErro(err));
    } finally {
      setProcessando(false);
    }
  }

  async function recusarPagamentoSimulado() {
    setProcessando(true);
    setErro("");
    try {
      await Promise.all(pagamentos.map((p) => recusarPagamento(p.id)));
      await Promise.all(reservas.map((r) => cancelarReserva(r.id)));
      setResultado("recusado");
    } catch (err) {
      setErro(extrairMensagemErro(err));
    } finally {
      setProcessando(false);
    }
  }

  if (reservaIds.length === 0) {
    return <Alert severity="info">Nenhum ingresso selecionado. Volte à página do evento para começar uma reserva.</Alert>;
  }

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (resultado === "aprovado") {
    return (
      <ResultadoCheckout
        icone={<CheckCircleOutlinedIcon sx={{ fontSize: 64 }} color="success" />}
        titulo="Pagamento aprovado"
        descricao="Seus ingressos já estão disponíveis, com o código em QR pronto para a entrada."
        acao={
          <Button variant="contained" color="secondary" onClick={() => navigate("/meus_ingressos")}>
            Ver meus ingressos
          </Button>
        }
      />
    );
  }

  if (resultado === "recusado") {
    return (
      <ResultadoCheckout
        icone={<HighlightOffIcon sx={{ fontSize: 64 }} color="error" />}
        titulo="Pagamento recusado"
        descricao="A reserva foi liberada. Você pode tentar novamente com outro método."
        acao={
          <Button variant="contained" color="secondary" onClick={() => navigate(-2)}>
            Tentar novamente
          </Button>
        }
      />
    );
  }

  const total = reservas.reduce((soma, r) => soma + Number(r.valor), 0);

  return (
    <Box maxWidth={560}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pagamento
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Ambiente de pagamento simulado — nenhuma cobrança real é feita.
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3, mb: 3 }}>
        <Typography variant="overline" color="text.secondary">
          Resumo do pedido
        </Typography>
        <Stack spacing={1} sx={{ mt: 1 }}>
          {reservas.map((r) => (
            <Stack key={r.id} direction="row" justifyContent="space-between">
              <Typography variant="body2">Ingresso #{r.id}</Typography>
              <Typography variant="body2" sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>
                {formatarPreco(r.valor)}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700}>
            Total
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: '"IBM Plex Mono", monospace' }}>
            {formatarPreco(total)}
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <CreditCardIcon color="action" />
          <Typography variant="subtitle1">Cartão simulado •••• 4242</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Escolha o resultado da simulação para testar os dois caminhos do checkout.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            disabled={processando}
            onClick={confirmarPagamento}
            startIcon={processando ? <CircularProgress size={18} /> : null}
          >
            Confirmar pagamento
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="large"
            disabled={processando}
            onClick={recusarPagamentoSimulado}
          >
            Simular recusa
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

function ResultadoCheckout({ icone, titulo, descricao, acao }) {
  return (
    <Box sx={{ textAlign: "center", py: 8, maxWidth: 440, mx: "auto" }}>
      {icone}
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        {titulo}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {descricao}
      </Typography>
      {acao}
    </Box>
  );
}

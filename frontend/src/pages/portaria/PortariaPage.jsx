import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import KeyboardIcon from "@mui/icons-material/Keyboard";

import { validarPorCodigo } from "../../api/validacoes";
import { cores } from "../../theme";

// Estados possíveis de leitura, cada um com cor e mensagem próprias.
// "evento_errado" fica mapeado aqui para quando o backend passar a
// aceitar um `evento` esperado na validação (ver observação no chat);
// hoje a API só distingue os outros três.
const ESTADOS = {
  valido: { cor: cores.verde, label: "Ingresso válido", Icone: CheckCircleOutlinedIcon },
  invalido: { cor: cores.vermelho, label: "Ingresso inválido", Icone: CancelIcon },
  utilizado: { cor: "#B8860B", label: "Ingresso já utilizado", Icone: HistoryToggleOffIcon },
  evento_errado: { cor: cores.vermelho, label: "Ingresso de outro evento", Icone: CancelIcon },
};

function classificarErro(err) {
  const mensagem = err?.response?.data?.detail || (typeof err?.response?.data === "string" ? err.response.data : "") || "";
  const status = err?.response?.status;

  if (status === 404) {
    return { estado: "invalido", mensagem: "Código não corresponde a nenhum ingresso emitido." };
  }
  if (mensagem.toLowerCase().includes("já foi utilizado")) {
    return { estado: "utilizado", mensagem };
  }
  if (mensagem.toLowerCase().includes("cancelado")) {
    return { estado: "invalido", mensagem };
  }
  return { estado: "invalido", mensagem: mensagem || "Não foi possível validar este ingresso." };
}

export default function PortariaPage() {
  const [modo, setModo] = useState("camera");
  const [codigoManual, setCodigoManual] = useState("");
  const [resultado, setResultado] = useState(null); // { estado, mensagem }
  const [validando, setValidando] = useState(false);
  const [erroCamera, setErroCamera] = useState("");

  const scannerRef = useRef(null);
  const leitorEmAndamentoRef = useRef(false);
  // Espelha "validando" numa ref: processarCodigo precisa ler o valor
  // mais recente sem depender do state diretamente — se dependesse,
  // useCallback abaixo teria que listar "validando" como dependência,
  // e cada início/fim de validação recriaria a função, o que forçaria
  // o efeito da câmera a reiniciar no meio do uso.
  const validandoRef = useRef(false);

  function definirValidando(valor) {
    validandoRef.current = valor;
    setValidando(valor);
  }

  const processarCodigo = useCallback(async (codigo) => {
    if (!codigo || validandoRef.current) return;
    definirValidando(true);
    try {
      await validarPorCodigo(codigo);
      setResultado({ estado: "valido", mensagem: "Entrada liberada." });
    } catch (err) {
      setResultado(classificarErro(err));
    } finally {
      definirValidando(false);
      // pausa a leitura por um instante para o operador ver o resultado
      // antes de aceitar o próximo código
      setTimeout(() => {
        leitorEmAndamentoRef.current = false;
      }, 1500);
    }
  }, []); // sem dependências externas: só usa refs e setters estáveis

  useEffect(() => {
    if (modo !== "camera") return undefined;

    let cancelado = false;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (cancelado) return;
      const leitor = new Html5Qrcode("leitor-qr-portaria");
      scannerRef.current = leitor;

      leitor
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (textoDecodificado) => {
            if (leitorEmAndamentoRef.current) return;
            leitorEmAndamentoRef.current = true;
            processarCodigo(textoDecodificado.trim());
          },
          () => {} // erros de frame sem QR são esperados e ignorados
        )
        .catch(() => {
          setErroCamera(
            "Não foi possível acessar a câmera. Verifique as permissões do navegador ou use a digitação manual."
          );
        });
    });

    return () => {
      cancelado = true;
      if (scannerRef.current) {
        // scannerRef.current.stop().catch(() => {});
        // scannerRef.current.clear();
        // scannerRef.current = null;
        const leitorAtual = scannerRef.current;
        scannerRef.current = null;
        leitorAtual
          .stop()
          .then(() => leitorAtual.clear())
          .catch(() => {});
      }
    };
  }, [modo, processarCodigo]);

  function enviarCodigoManual(e) {
    e.preventDefault();
    processarCodigo(codigoManual.trim());
    setCodigoManual("");
  }

  const infoEstado = resultado ? ESTADOS[resultado.estado] : null;

  return (
    <Box maxWidth={520} mx="auto">
      <Typography variant="h4" component="h1" gutterBottom>
        Portaria
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Aponte a câmera para o QR do ingresso ou digite o código manualmente.
      </Typography>

      <ToggleButtonGroup
        exclusive
        value={modo}
        onChange={(_, novoModo) => {
          if (!novoModo) return;
          // limpar aqui, não dentro do efeito: este é um handler de
          // clique de verdade, então o setState síncrono é legítimo —
          // é uma resposta direta à ação do usuário, não um efeito
          // colateral de sincronização.
          if (novoModo === "camera") setErroCamera("");
          setModo(novoModo);
        }}
        fullWidth
        sx={{ mb: 3 }}
      >
        <ToggleButton value="camera">
          <QrCodeScannerIcon sx={{ mr: 1 }} fontSize="small" /> Câmera
        </ToggleButton>
        <ToggleButton value="manual">
          <KeyboardIcon sx={{ mr: 1 }} fontSize="small" /> Digitar código
        </ToggleButton>
      </ToggleButtonGroup>

      {modo === "camera" ? (
        <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
          {erroCamera && <Alert severity="warning" sx={{ mb: 2 }}>{erroCamera}</Alert>}
          <Box
            id="leitor-qr-portaria"
            sx={{
              width: "100%",
              minHeight: 280,
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: cores.tinta,
            }}
          />
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
          <Box component="form" onSubmit={enviarCodigoManual}>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                autoFocus
                label="Código do ingresso"
                placeholder="Cole ou digite o código exibido no ingresso"
                value={codigoManual}
                onChange={(e) => setCodigoManual(e.target.value)}
                sx={{ "& input": { fontFamily: '"IBM Plex Mono", monospace' } }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!codigoManual.trim() || validando}
              >
                Validar
              </Button>
            </Stack>
          </Box>
        </Paper>
      )}

      {validando && (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 3 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Validando...
          </Typography>
        </Stack>
      )}

      {resultado && !validando && (
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            border: `2px solid ${infoEstado.cor}`,
            backgroundColor: `${infoEstado.cor}14`,
            textAlign: "center",
          }}
        >
          <infoEstado.Icone sx={{ fontSize: 56, color: infoEstado.cor }} />
          <Typography variant="h5" sx={{ mt: 1, color: infoEstado.cor }}>
            {infoEstado.label}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {resultado.mensagem}
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

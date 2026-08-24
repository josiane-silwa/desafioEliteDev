import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
//import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Autocomplete from "@mui/material/Autocomplete";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";

import {
  buscarEvento,
  criarEvento,
  atualizarEvento,
  buscarCatalogoExterno,
  criarAssento,
  listarAssentos,
} from "../../api/eventos";
import { extrairMensagemErro } from "../../api/client";

const TIPOS = [
  { value: "presencial", label: "Presencial" },
  { value: "online", label: "Online" },
  { value: "digital", label: "Conteúdo digital" },
];

const CAMPOS_INICIAIS = {
  titulo: "",
  descricao: "",
  tipo: "presencial",
  data_inicio: "",
  data_fim: "",
  preco: "",
  capacidade: "",
  local: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
};

export default function EventoFormPage() {
  const { id } = useParams();
  const ehEdicao = Boolean(id);
  const navigate = useNavigate();

  const [campos, setCampos] = useState(CAMPOS_INICIAIS);
  const [catalogo, setCatalogo] = useState(null);
  const [opcoesCatalogo, setOpcoesCatalogo] = useState([]);
  const [carregando, setCarregando] = useState(ehEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [eventoId, setEventoId] = useState(id ? Number(id) : null);
  const [totalAssentos, setTotalAssentos] = useState(0);

  useEffect(() => {
    if (!ehEdicao) return;
    buscarEvento(id)
      .then((evento) => {
        setCampos({
          titulo: evento.titulo,
          descricao: evento.descricao || "",
          tipo: evento.tipo,
          data_inicio: evento.data_inicio?.slice(0, 16) || "",
          data_fim: evento.data_fim?.slice(0, 16) || "",
          preco: evento.preco,
          capacidade: evento.capacidade,
          local: evento.local || "",
          endereco: evento.endereco || "",
          numero: evento.numero || "",
          complemento: evento.complemento || "",
          bairro: evento.bairro || "",
          cidade: evento.cidade || "",
          estado: evento.estado || "",
          cep: evento.cep || "",
        });
        setCatalogo(evento.catalogo);
        setTotalAssentos((evento.assentos || []).length);
      })
      .finally(() => setCarregando(false));
  }, [id, ehEdicao]);

  function atualizarCampo(nome, valor) {
    setCampos((atual) => ({ ...atual, [nome]: valor }));
  }

  async function buscarNoCatalogo(termo) {
    if (!termo) {
      setOpcoesCatalogo([]);
      return;
    }
    const resultado = await buscarCatalogoExterno({ search: termo });
    setOpcoesCatalogo(Array.isArray(resultado) ? resultado : resultado.results || []);
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    try {
      const payload = {
        ...campos,
        catalogo: catalogo?.id,
        preco: Number(campos.preco),
        capacidade: Number(campos.capacidade),
      };
      if (ehEdicao) {
        await atualizarEvento(id, payload);
        navigate("/organizador/eventos");
      } else {
        const criado = await criarEvento(payload);
        setEventoId(criado.id);
        // segue na mesma página para o organizador configurar os
        // assentos antes de publicar — replica o fluxo do Sympla, que
        // não deixa publicar sem a configuração de ingressos.
        navigate(`/organizador/eventos/${criado.id}`, { replace: true });
      }
    } catch (err) {
      setErro(extrairMensagemErro(err));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <Skeleton variant="rounded" height={500} />;
  }

  return (
    <Box maxWidth={720}>
      <Typography variant="h4" component="h1" gutterBottom>
        {ehEdicao ? "Editar evento" : "Criar evento"}
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Paper elevation={0} component="form" onSubmit={salvar} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Autocomplete
            options={opcoesCatalogo}
            value={catalogo}
            onChange={(_, valor) => setCatalogo(valor)}
            onInputChange={(_, valor) => buscarNoCatalogo(valor)}
            getOptionLabel={(opcao) => opcao.titulo || ""}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Item do catálogo (Ticketmaster / TMDb)"
                helperText="Busque o show ou filme original para vincular a este evento"
                required
              />
            )}
          />

          <TextField
            label="Título do evento"
            value={campos.titulo}
            onChange={(e) => atualizarCampo("titulo", e.target.value)}
            required
          />
          <TextField
            label="Descrição"
            value={campos.descricao}
            onChange={(e) => atualizarCampo("descricao", e.target.value)}
            multiline
            minRows={3}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Tipo"
              value={campos.tipo}
              onChange={(e) => atualizarCampo("tipo", e.target.value)}
              fullWidth
            >
              {TIPOS.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Preço (R$)"
              type="number"
              inputProps={{ step: "0.01", min: 0 }}
              value={campos.preco}
              onChange={(e) => atualizarCampo("preco", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Capacidade"
              type="number"
              inputProps={{ min: 1 }}
              value={campos.capacidade}
              onChange={(e) => atualizarCampo("capacidade", e.target.value)}
              fullWidth
              required
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Início"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={campos.data_inicio}
              onChange={(e) => atualizarCampo("data_inicio", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Término"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={campos.data_fim}
              onChange={(e) => atualizarCampo("data_fim", e.target.value)}
              fullWidth
              required
            />
          </Stack>

          <Divider>Local</Divider>

          <TextField
            label="Nome do local"
            value={campos.local}
            onChange={(e) => atualizarCampo("local", e.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Endereço"
              value={campos.endereco}
              onChange={(e) => atualizarCampo("endereco", e.target.value)}
              fullWidth
              sx={{ flex: 2 }}
            />
            <TextField
              label="Número"
              value={campos.numero}
              onChange={(e) => atualizarCampo("numero", e.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Bairro"
              value={campos.bairro}
              onChange={(e) => atualizarCampo("bairro", e.target.value)}
              fullWidth
            />
            <TextField
              label="Cidade"
              value={campos.cidade}
              onChange={(e) => atualizarCampo("cidade", e.target.value)}
              fullWidth
            />
            <TextField
              label="UF"
              value={campos.estado}
              onChange={(e) => atualizarCampo("estado", e.target.value.toUpperCase())}
              inputProps={{ maxLength: 2 }}
              sx={{ width: { sm: 100 } }}
            />
            <TextField
              label="CEP"
              value={campos.cep}
              onChange={(e) => atualizarCampo("cep", e.target.value)}
              sx={{ width: { sm: 140 } }}
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="secondary" disabled={salvando}>
              {salvando ? "Salvando..." : ehEdicao ? "Salvar alterações" : "Criar e configurar ingressos"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {eventoId && (
        <ConfiguracaoDeIngressos
          eventoId={eventoId}
          totalAssentos={totalAssentos}
          onAssentosCriados={(qtd) => setTotalAssentos((atual) => atual + qtd)}
        />
      )}
    </Box>
  );
}

// Gera os assentos do evento: mapa (filas x cadeiras, para cinema/
// teatro) ou pista (quantidade de ingressos anônimos, sem lugar
// marcado — código "PISTA-000N"). Essa distinção é o que a
// EventoDetailPage usa para decidir qual fluxo de reserva mostrar.
function ConfiguracaoDeIngressos({ eventoId, totalAssentos, onAssentosCriados }) {
  const [modo, setModo] = useState("mapa");
  const [filas, setFilas] = useState(5);
  const [cadeirasPorFila, setCadeirasPorFila] = useState(10);
  const [quantidadePista, setQuantidadePista] = useState(100);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function gerarMapa() {
    setGerando(true);
    setErro("");
    setSucesso("");
    try {
      const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, filas).split("");
      let criados = 0;
      for (const letra of letras) {
        for (let numero = 1; numero <= cadeirasPorFila; numero += 1) {
          await criarAssento({
            evento: eventoId,
            codigo: `${letra}${String(numero).padStart(2, "0")}`,
            fila: letra,
            numero,
          });
          criados += 1;
        }
      }
      setSucesso(`${criados} assento(s) criado(s).`);
      onAssentosCriados(criados);
    } catch (err) {
      setErro(extrairMensagemErro(err));
    } finally {
      setGerando(false);
    }
  }

  async function gerarPista() {
    setGerando(true);
    setErro("");
    setSucesso("");
    try {
      const existentes = await listarAssentos(eventoId);
      const lista = Array.isArray(existentes) ? existentes : existentes.results || [];
      const proximoIndice = lista.length + 1;

      for (let i = 0; i < quantidadePista; i += 1) {
        const numero = proximoIndice + i;
        await criarAssento({
          evento: eventoId,
          codigo: `PISTA-${String(numero).padStart(4, "0")}`,
          fila: "",
          numero,
        });
      }
      setSucesso(`${quantidadePista} ingresso(s) de pista criado(s).`);
      onAssentosCriados(quantidadePista);
    } catch (err) {
      setErro(extrairMensagemErro(err));
    } finally {
      setGerando(false);
    }
  }

  return (
    <Paper elevation={0} sx={{ p: 3, mt: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">Ingressos deste evento</Typography>
        <Chip label={`${totalAssentos} criado(s)`} size="small" />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Publique o evento somente depois de configurar os ingressos.
      </Typography>

      <Tabs value={modo} onChange={(_, v) => setModo(v)} sx={{ mb: 2 }}>
        <Tab value="mapa" label="Mapa de assentos" />
        <Tab value="pista" label="Pista (quantidade)" />
      </Tabs>

      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

      {modo === "mapa" ? (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
          <TextField
            label="Número de filas"
            type="number"
            inputProps={{ min: 1, max: 26 }}
            value={filas}
            onChange={(e) => setFilas(Number(e.target.value))}
          />
          <TextField
            label="Cadeiras por fila"
            type="number"
            inputProps={{ min: 1, max: 60 }}
            value={cadeirasPorFila}
            onChange={(e) => setCadeirasPorFila(Number(e.target.value))}
          />
          <Button variant="contained" onClick={gerarMapa} disabled={gerando}>
            {gerando ? "Gerando..." : `Gerar ${filas * cadeirasPorFila} assentos`}
          </Button>
        </Stack>
      ) : (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
          <TextField
            label="Quantidade de ingressos"
            type="number"
            inputProps={{ min: 1, max: 5000 }}
            value={quantidadePista}
            onChange={(e) => setQuantidadePista(Number(e.target.value))}
          />
          <Button variant="contained" onClick={gerarPista} disabled={gerando}>
            {gerando ? "Gerando..." : `Gerar ${quantidadePista} ingressos`}
          </Button>
        </Stack>
      )}
    </Paper>
  );
}

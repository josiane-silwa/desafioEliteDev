import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";

import { cadastrar } from "../../api/auth";
import { extrairMensagemErro } from "../../api/client";

const INICIAL = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  cpf: "",
  password: "",
  password2: "",
};

export default function CadastroPage() {
  const navigate = useNavigate();
  const [campos, setCampos] = useState(INICIAL);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  function atualizar(nome, valor) {
    setCampos((atual) => ({ ...atual, [nome]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErro("");
    try {
      await cadastrar({ ...campos, role: "cliente" });
      navigate("/entrar", { state: { cadastroConcluido: true } });
    } catch (err) {
      setErro(extrairMensagemErro(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Box maxWidth={480} mx="auto" sx={{ py: { xs: 4, sm: 6 } }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Criar conta
      </Typography>
      <Paper elevation={0} component="form" onSubmit={handleSubmit} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
        <Stack spacing={2.5}>
          {erro && <Alert severity="error">{erro}</Alert>}
          <Stack direction="row" spacing={2}>
            <TextField label="Nome" value={campos.first_name} onChange={(e) => atualizar("first_name", e.target.value)} fullWidth required />
            <TextField label="Sobrenome" value={campos.last_name} onChange={(e) => atualizar("last_name", e.target.value)} fullWidth required />
          </Stack>
          <TextField label="Usuário" value={campos.username} onChange={(e) => atualizar("username", e.target.value)} required />
          <TextField label="E-mail" type="email" value={campos.email} onChange={(e) => atualizar("email", e.target.value)} required />
          <TextField
            label="CPF"
            value={campos.cpf}
            onChange={(e) => atualizar("cpf", e.target.value.replace(/\D/g, ""))}
            inputProps={{ maxLength: 11 }}
            helperText="Somente números"
            required
          />
          <TextField label="Senha" type="password" value={campos.password} onChange={(e) => atualizar("password", e.target.value)} required />
          <TextField
            label="Confirmar senha"
            type="password"
            value={campos.password2}
            onChange={(e) => atualizar("password2", e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="secondary" size="large" disabled={enviando}>
            {enviando ? "Criando conta..." : "Criar conta"}
          </Button>
          <Typography variant="body2" textAlign="center">
            Já tem conta?{" "}
            <Link component={RouterLink} to="/entrar">
              Entrar
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

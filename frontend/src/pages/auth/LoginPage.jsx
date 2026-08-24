import { useState } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";

import { useAuth } from "../../context/AuthContext";
import { extrairMensagemErro } from "../../api/client";

export default function LoginPage() {
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEntrando(true);
    setErro("");
    try {
      const perfil = await entrar(username, password);
      const destino =
        location.state?.proximaRota ||
        (perfil.role === "organizador"
          ? "/organizador/eventos"
          : perfil.role === "portaria"
          ? "/portaria"
          : "/");
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(extrairMensagemErro(err) || "Usuário ou senha inválidos.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <Box maxWidth={400} mx="auto" sx={{ py: { xs: 4, sm: 8 } }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Entrar
      </Typography>
      <Paper elevation={0} component="form" onSubmit={handleSubmit} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
        <Stack spacing={2.5}>
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="secondary" size="large" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </Button>
          <Typography variant="body2" textAlign="center">
            Não tem conta?{" "}
            <Link component={RouterLink} to="/cadastro">
              Cadastre-se
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { usuario, autenticado, isOrganizador, isPortaria, sair } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  function sairEVoltar() {
    setAnchorEl(null);
    sair();
    navigate("/");
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "inherit",
            textDecoration: "none",
            mr: 1,
          }}
        >
          <ConfirmationNumberOutlinedIcon />
          <Typography variant="h6" component="span" sx={{ fontSize: "1.15rem" }}>
            Bilheteria
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {isOrganizador && (
          <Button color="inherit" component={RouterLink} to="/organizador/eventos">
            Meus eventos
          </Button>
        )}
        {isPortaria && (
          <Button color="inherit" component={RouterLink} to="/portaria">
            Portaria
          </Button>
        )}
        {autenticado && !isOrganizador && !isPortaria && (
          <Button color="inherit" component={RouterLink} to="/meus-ingressos">
            Meus ingressos
          </Button>
        )}

        {autenticado ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", color: "primary.main" }}>
                {(usuario?.first_name || usuario?.username || "?").charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>{usuario?.first_name || usuario?.username}</MenuItem>
              <MenuItem onClick={sairEVoltar}>Sair</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="secondary" variant="contained" component={RouterLink} to="/entrar">
            Entrar
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

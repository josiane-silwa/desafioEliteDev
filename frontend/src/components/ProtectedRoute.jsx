import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { autenticado, carregando, usuario } = useAuth();

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!autenticado) {
    return <Navigate to="/entrar" replace />;
  }

  if (roles && !roles.includes(usuario?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

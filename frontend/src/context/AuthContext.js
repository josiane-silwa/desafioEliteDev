import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setCarregando(false);
      return;
    }
    authApi
      .buscarMeuPerfil()
      .then(setUsuario)
      .catch(() => authApi.logout())
      .finally(() => setCarregando(false));
  }, []);

  async function entrar(username, password) {
    await authApi.login(username, password);
    const perfil = await authApi.buscarMeuPerfil();
    setUsuario(perfil);
    return perfil;
  }

  function sair() {
    authApi.logout();
    setUsuario(null);
  }

  const value = useMemo(
    () => ({
      usuario,
      carregando,
      autenticado: Boolean(usuario),
      isOrganizador: usuario?.role === "organizador",
      isCliente: usuario?.role === "cliente",
      isPortaria: usuario?.role === "portaria",
      entrar,
      sair,
    }),
    [usuario, carregando]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}

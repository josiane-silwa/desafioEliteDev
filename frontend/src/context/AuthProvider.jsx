import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authApi from "../api/auth";
import Api from "../api/Api";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Api.get("/csrf/")
      .catch(() => {})
      .finally(() => {
        authApi
          .buscarMeuPerfil()
          .then(setUsuario)
          .catch(() => setUsuario(null))
          .finally(() => setCarregando(false));
      });
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
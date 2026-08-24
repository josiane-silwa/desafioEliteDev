import Api from "./Api";

// Assume endpoints de token JWT (djangorestframework-simplejwt) do tipo
// /api/token/ e /api/token/refresh/. Ajustar os paths caso o backend use
// outro esquema de autenticação.
export async function login(username, password) {
  const { data } = await Api.post("/token/", { username, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function cadastrar(payload) {
  const { data } = await Api.post("/usuarios/", payload);
  return data;
}

export async function buscarMeuPerfil() {
  const { data } = await Api.get("/usuarios/me/");
  return data;
}

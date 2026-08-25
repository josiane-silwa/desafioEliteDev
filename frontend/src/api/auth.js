import Api from "./Api";

export async function login(username, password) {
  const { data } = await Api.post("/login/", {
    username,
    password,
  });

  return data;
}

export async function logout() {
  await Api.post("/logout/");
}

export async function cadastrar(payload) {
  const { data } = await Api.post("/usuarios/", payload);
  console.log("data de auth",data)
  return data;
}

export async function buscarMeuPerfil() {
try {
    const response = await Api.get("/usuarios/me/"); // ou seu endpoint de perfil
    return response.data;
  } catch (error) {
    // Se não estiver autenticado (401/403), apenas retorna null sem travar a aplicação
    if (error.response?.status === 401 || error.response?.status === 403) {
      return null;
    }
    throw error;
  }
}

// export async function buscarMeuPerfil() {
//   const { data } = await Api.get("/usuarios/me/");
//   return data;
// }

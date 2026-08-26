import axios from "axios";

//const baseURL = "http://localhost:8000/app/";
// const baseURL = import.meta.env.VITE_API_BASE_URL_DEPLOY || "http://localhost:8000/app/";
const baseURL = "/app/";

const Api = axios.create({
  baseURL,
  withCredentials: true, // Essencial para envio de cookies de sessão e CSRF
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

// Interceptor para garantir a injeção manual do X-CSRFToken em métodos mutáveis
Api.interceptors.request.use((config) => {
  if (["post", "put", "patch", "delete"].includes(config.method?.toLowerCase())) {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
  }
  return config;
});

export function extrairMensagemErro(error) {
  const data = error?.response?.data;
  if (!data) return "Não foi possível completar a operação. Tente novamente.";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;

  const primeiraChave = Object.keys(data)[0];
  if (primeiraChave) {
    const valor = data[primeiraChave];
    const texto = Array.isArray(valor) ? valor[0] : valor;
    return `${primeiraChave}: ${texto}`;
  }
  return "Não foi possível completar a operação. Tente novamente.";
}

export default Api;
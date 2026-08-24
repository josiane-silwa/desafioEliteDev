import axios from 'axios'

// para deploy no django
//const isDevelopment = import.meta.env.MODE === 'development'
//const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY

// (variável de ambiente VITE_API_URL).
//const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";
const baseURL = "http://localhost:8000/api/";

const Api = axios.create({ baseURL });

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extrai uma mensagem de erro legível a partir da resposta padrão do
// DRF (que pode vir como {campo: [...]}, {detail: "..."} ou string).
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
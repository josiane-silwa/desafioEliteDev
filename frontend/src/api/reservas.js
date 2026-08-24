import Api from "./Api";

export async function criarReserva({ evento, assento, valor }) {
  const { data } = await Api.post("/reservas/", { evento, assento, valor });
  return data;
}

export async function listarMinhasReservas(params = {}) {
  const { data } = await Api.get("/reservas/", { params });
  return data;
}

export async function buscarReserva(id) {
  const { data } = await Api.get(`/reservas/${id}/`);
  return data;
}

export async function cancelarReserva(id) {
  const { data } = await Api.post(`/reservas/${id}/cancelar/`);
  return data;
}

import Api from "./Api";

export async function emitirIngresso(reservaId) {
  const { data } = await Api.post("/ingressos/", { reserva: reservaId });
  return data;
}

export async function listarMeusIngressos(params = {}) {
  const { data } = await Api.get("/ingressos/", { params });
  return data;
}

export async function buscarIngresso(id) {
  const { data } = await Api.get(`/ingressos/${id}/`);
  return data;
}

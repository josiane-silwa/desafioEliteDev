import Api from "./Api";

export async function listarEventosPublicados(params = {}) {
  const { data } = await Api.get("/eventos/", { params });
  return data;
}

export async function buscarEvento(id) {
  const { data } = await Api.get(`/eventos/${id}/`);
  return data;
}

export async function listarMeusEventos(params = {}) {
  // para o organizador: get_queryset já retorna os eventos dele
  // (inclusive rascunhos) quando autenticado como organizador.
  const { data } = await Api.get("/eventos/", { params });
  return data;
}

export async function criarEvento(payload) {
  const { data } = await Api.post("/eventos/", payload);
  return data;
}

export async function atualizarEvento(id, payload) {
  const { data } = await Api.patch(`/eventos/${id}/`, payload);
  return data;
}

export async function publicarEvento(id) {
  const { data } = await Api.post(`/eventos/${id}/publicar/`);
  return data;
}

export async function cancelarEvento(id) {
  const { data } = await Api.post(`/eventos/${id}/cancelar/`);
  return data;
}

export async function listarAssentos(eventoId) {
  const { data } = await Api.get("/assentos/", { params: { evento: eventoId } });
  return data;
}

export async function criarAssento(payload) {
  const { data } = await Api.post("/assentos/", payload);
  return data;
}

export async function buscarCatalogoExterno(params = {}) {
  const { data } = await Api.get("/catalogo_externo/", { params });
  return data;
}

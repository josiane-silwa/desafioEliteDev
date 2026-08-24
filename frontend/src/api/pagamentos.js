import Api from "./Api";

export async function criarPagamento({ reserva, valor, metodo = "simulado" }) {
  const { data } = await Api.post("/pagamentos/", { reserva, valor, metodo });
  return data;
}

export async function aprovarPagamento(id) {
  const { data } = await Api.post(`/pagamentos/${id}/aprovar/`);
  return data;
}

export async function recusarPagamento(id) {
  const { data } = await Api.post(`/pagamentos/${id}/recusar/`);
  return data;
}

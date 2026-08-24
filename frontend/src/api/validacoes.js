import Api from "./Api";

// Valida por código lido do QR ou digitado manualmente. O backend
// (services.ingresso_validar_por_codigo) já garante que a validação
// só é aceita uma vez e marca o ingresso como utilizado.
export async function validarPorCodigo(codigo) {
  const { data } = await Api.post("/validacoes_ingresso/validar-por-codigo/", { codigo });
  return data;
}

// A API não expõe o ingresso por código diretamente para leitura;
// usamos o próprio retorno de erro/sucesso da validação para
// classificar o estado exibido na portaria (ver PortariaPage).

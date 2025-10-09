/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/mensagem-erro.ts (ou httpError.ts – padronize o import)
import { AxiosError } from "axios";

export function mensagemDeErro(err: unknown): string {
  const ax = err as AxiosError<any>;
  const data = ax?.response?.data ?? err as any;

  // 422: lista de erros do validador
  const lista = (Array.isArray(data?.errors) && data.errors)
    || (Array.isArray(data?.erros) && data.erros);

  if (lista?.length) {
    const linhas = lista.map((e: any) => {
      const campo = e?.campo ?? e?.path ?? e?.param ?? "campo";
      const msg = e?.mensagem ?? e?.msg ?? "inválido";
      return `${campo}: ${msg}`;
    });
    return linhas.join("\n"); // várias linhas
  }

  // mensagens simples
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.mensagem === "string") return data.mensagem;
  if (typeof data?.erro === "string") return data.erro;
  if (typeof data?.error === "string") return data.error;

  if (ax?.response) return `Erro ${ax.response.status}`;
  if (ax?.request) return "Sem resposta do servidor. Verifique sua conexão.";
  return (err as any)?.message || "Erro inesperado";
}

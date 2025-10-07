// src/utils/httpError.ts
import { AxiosError } from "axios";

export function mensagemDeErro(err: unknown): string {
  const error = err as AxiosError<unknown>;
  if (error?.response) {
    // tente várias chaves comuns
    const data = error.response.data as Record<string, unknown>;
    return (
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.mensagem === "string" && data.mensagem) ||
      (typeof data?.erro === "string" && data.erro) ||
      (typeof data?.error === "string" && data.error) ||
      `Erro ${error.response.status}`
    );
  }
  if (error?.request) {
    return "Sem resposta do servidor. Verifique sua conexão.";
  }
  return (error as { message?: string })?.message || "Erro inesperado";
}

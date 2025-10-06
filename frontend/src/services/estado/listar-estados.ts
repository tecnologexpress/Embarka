/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../api";
import type { parametrosDeQuery } from "../../tipos/parametros-query";

const listarEstados = async (params: parametrosDeQuery) => {
    try {
        const resultado = await api.get("/estado/listar", { params });
        return resultado.data;

    } catch (error: any) {
        console.error("Erro ao listar estados:", error);
        throw error;
    }
}

export default listarEstados;
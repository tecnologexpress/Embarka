/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../../api";
import type { parametrosDeQuery } from "../../tipos/parametros-query";

const listarMunicipios = async (params: parametrosDeQuery) => {
    try {
        const resultado = await api.get("/municipio/listar", { params });
        return resultado.data;

    } catch (error: any) {
        throw new error;
    }
}

export default listarMunicipios;
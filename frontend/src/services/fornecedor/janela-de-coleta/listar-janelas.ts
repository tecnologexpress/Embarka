import { api } from "../../../api";
import type { IParametrosDeQuery } from "../../../tipos/parametros-query";

const listarJanelaDeColetaFornecedor = async (params: IParametrosDeQuery) => {
    try {
        const resultado = await api.get("/janela-coleta-fornecedor/", { params });
        return resultado.data;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new error;
    }
}

export default listarJanelaDeColetaFornecedor;
import { api } from "../../../api";

const deletarJanelaDeColetaFornecedor = async (id: number) => {
    try {
        const resultado = await api.delete(`/janela-coleta-fornecedor/${id}`);
        return resultado.data;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new error;
    }
}

export default deletarJanelaDeColetaFornecedor;
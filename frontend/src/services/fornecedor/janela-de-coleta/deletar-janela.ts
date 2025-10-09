import { api } from "../../../api";

const deletarJanelaDeColetaFornecedor = async (prm_id: number) => {
    try {
        const resultado = await api.delete(`/janela-coleta-fornecedor/${prm_id}`);
        return resultado.data;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new error;
    }
}

export default deletarJanelaDeColetaFornecedor;
import { api } from "../../../api";
import type { IAtualizarJanelaDeColetaDto } from "../../../dto/fornecedor/janela-de-coleta";

const atualizarJanelaDeColetaFornecedor = async (dados: IAtualizarJanelaDeColetaDto) => {
    try {
        const resultado = await api.put("/janela-coleta-fornecedor/", dados);
        return resultado.data;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new error;
    }
}

export default atualizarJanelaDeColetaFornecedor;
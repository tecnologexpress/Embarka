import { api } from "../../../api";
import type { ICriarJanelaDeColeta } from "../../../dto/fornecedor/janela-de-coleta";

interface Props {
    dados: ICriarJanelaDeColeta;
}

const criarJanelaDeColetaFornecedor = async (dados: Props) => {
    try {
        const resultado = await api.post("/janela-coleta-fornecedor/", { dados });
        return resultado.data;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new error;
    }
}

export default criarJanelaDeColetaFornecedor;
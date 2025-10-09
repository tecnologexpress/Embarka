import { api } from "../../../api";
import type { ICriarJanelaDeColetaFornecedorDto } from "../../../dto/fornecedor/janela-de-coleta";

const criarJanelaDeColetaFornecedor = async (dados: ICriarJanelaDeColetaFornecedorDto) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const resultado = await api.post("/janela-coleta-fornecedor/", dados);
        return resultado.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // "throw new error" é uma sintaxe incorreta
        throw error;
    }
}

export default criarJanelaDeColetaFornecedor;

import { api } from "../../api";
import type { IPessoaDTO } from "../../dto/pessoa";

interface RegistroData {
    data: IPessoaDTO,
    senha: string,
    role: "FORNECEDOR" | "CLIENTE" | "EMBARCADOR" | "TRANSPORTADORA"
}

const registrar = async ({ data, senha, role }: RegistroData) => {

    console.log("Dados de registro recebidos:", { data, senha, role });

    // eslint-disable-next-line no-useless-catch
    try {
        // CORREÇÃO AQUI: Enviamos um objeto unificado (data, senha, role no mesmo nível)
        const payload = {
            ...data, // Espalha os campos do IPessoaDTO
            senha,
            role,
        };

        const response = await api.post("/pessoa/criar", payload);
        return response.data;
    } catch (err) {
        throw err;
    }
}

export default registrar;

import { api } from "../../api";
import type { IPessoaDTO } from "../../dto/pessoa";

interface RegistroData {
    data: IPessoaDTO,
    senha: string
}

const registrar = async ({data, senha}: RegistroData) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post("/pessoa/criar", { data, senha });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export default registrar;
import { api } from "../../api";
import type { RegistrarPessoaDto } from "../../dto/registrar-pessoa";

interface RegistroData {
    data: RegistrarPessoaDto
}

const registrar = async (data: RegistroData) => {
    try {
        const response = await api.post("/pessoa/register", data);
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new error;
    }
}

export default registrar;
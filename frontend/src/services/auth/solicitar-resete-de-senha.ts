import { api } from "../../api";

const solicitarReseteDeSenha = async (email: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post("/auth/recuperar/solicitar", { email });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export default solicitarReseteDeSenha;

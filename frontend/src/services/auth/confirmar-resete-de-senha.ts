import { api } from "../../api";

const confirmarReseteDeSenha = async (token: string, prm_nova_senha: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post("/auth/recuperar/confirmar", { token, nova_senha: prm_nova_senha });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export default confirmarReseteDeSenha;

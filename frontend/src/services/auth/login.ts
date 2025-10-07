import { api } from "../../api";

const login = async (email: string, senha: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post("/auth/login", { email, senha });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export default login;
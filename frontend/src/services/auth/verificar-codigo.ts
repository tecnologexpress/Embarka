import { api } from "../../api";

const verificarCodigo = async (codigo: number) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post("/auth/verificar-codigo", { codigo });
        return response.data;
    } catch (err) {
        throw err;
    }
}

export default verificarCodigo;

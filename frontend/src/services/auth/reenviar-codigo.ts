import { api } from "../../api";

const reenviarCodigo = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await api.post("/auth/reenviar-codigo");
        return response.data;
    } catch (err) {
        throw err;
    }
}

export default reenviarCodigo;

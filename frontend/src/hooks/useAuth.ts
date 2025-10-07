import { useEffect, useState } from "react";
import { api } from "../api";

/**
 * Hook React customizado para gerenciamento do estado de autenticação.
 *
 * Este hook é utilizado ao fazer login e para persistir os dados de autenticação durante a navegação entre páginas.
 * Ele verifica se o usuário está autenticado e se já aceitou as políticas de privacidade.
 * O hook busca as informações do usuário no backend e atualiza o estado de autenticação conforme o resultado.
 *
 * @returns {Object} Um objeto contendo:
 *   - `isAuthenticated`: Indica se o usuário está autenticado (`true`), não autenticado (`false`) ou ainda não determinado (`null`).
 *   - `loading`: Booleano que indica se a verificação de autenticação está em andamento.
 *   - `aceitouTermos`: Booleano que indica se o usuário já aceitou as políticas de privacidade.
 */
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    // const [aceitouTermos, setAceitouTermos] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await api.get("/auth/me", {
                    withCredentials: true, // permite enviar o cookie via HttpOnly
                });

                if (res.status === 200) {
                    // setAceitouTermos(res.data.politica_aceita);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    return { isAuthenticated, loading,
        // aceitouTermo
     };
}
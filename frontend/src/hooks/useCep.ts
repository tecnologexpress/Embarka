import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { consultarCep } from "../services/consulta-cep";

/**
 * Hook para gerenciar a lógica de consulta de CEP para um bloco de endereço.
 * @param namePrefix - O prefixo do nome dos campos no formulário (ex: 'enderecoColeta' ou 'itens.0.enderecoEntrega').
 * @param handleChange - A função `handleChange` do formulário principal, que sabe como atualizar o estado aninhado.
 */
/**
 * Hook para consulta de endereço a partir de um CEP, atualizando campos de formulário de forma centralizada.
 *
 * @param namePrefix Prefixo do nome dos campos do formulário (usado para compor o nome completo do campo).
 * @param handleChange Função de callback para atualizar os campos do formulário, disparando eventos de mudança sintéticos.
 * 
 * @returns Um objeto contendo:
 *   - consultandoCep: booleano indicando se a consulta ao CEP está em andamento.
 *   - buscarEnderecoPorCep: função assíncrona que consulta o CEP e atualiza os campos do formulário.
 *
 * ### Funcionalidades:
 * - Limpa o CEP informado, removendo caracteres não numéricos.
 * - Consulta o serviço de CEP usando a função `consultarCep`.
 * - Mapeia os campos retornados pela API (`logradouro`, `bairro`, `uf`, `municipio_ibge`) para os campos do formulário.
 * - Atualiza apenas os campos que possuem valor retornado pela API.
 * - Exibe mensagem de aviso em caso de erro na consulta.
 *
 * ### Campos atualizados:
 * - `${namePrefix}.logradouro`: Rua/avenida retornada pelo CEP.
 * - `${namePrefix}.bairro`: Bairro retornado pelo CEP.
 * - `${namePrefix}.uf`: Unidade Federativa (estado) retornada pelo CEP.
 * - `${namePrefix}.municipio_ibge`: Código IBGE do município retornado pelo CEP.
 *
 * Outros campos podem ser adicionados conforme necessário.
 */
export const useCep = (
    namePrefix: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
) => {
    const [consultando, setConsultando] = useState(false);

    /**
     * Executa a busca do CEP e atualiza o formulário com os dados retornados.
     * @param cep O CEP a ser consultado.
     */
    const buscarEnderecoPorCep = useCallback(
        async (cep: string) => {
            const cepLimpo = cep.replace(/\D/g, "");
            if (cepLimpo.length !== 8) return;

            setConsultando(true);
            try {
                // Usando a sua função 'consultarCep'
                const dadosCep = await consultarCep(cepLimpo);

                // Mapeia os campos da resposta da API para os nomes dos campos no seu formulário
                const camposParaAtualizar = {
                    logradouro: dadosCep.logradouro,
                    bairro: dadosCep.bairro,
                    uf: dadosCep.uf,
                    municipio_ibge: dadosCep.ibge,
                    // Adicione outros campos se necessário
                };

                // Dispara eventos de mudança sintéticos para cada campo retornado,
                // atualizando o formulário principal de forma centralizada.
                for (const [campo, valor] of Object.entries(camposParaAtualizar)) {
                    if (valor) {
                        // Só atualiza se a API retornou um valor para o campo
                        handleChange({
                            target: {
                                name: `${namePrefix}.${campo}`,
                                value: valor,
                            },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                // O toast pode mostrar a mensagem de erro que sua função já retorna
                toast.warn(error.response?.data?.message || "Erro ao consultar o serviço de CEP.");
            } finally {
                setConsultando(false);
            }
        },
        [namePrefix, handleChange]
    );

    return { consultandoCep: consultando, buscarEnderecoPorCep };
};
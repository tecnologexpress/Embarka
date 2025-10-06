// Localização: src/hooks/useBuscaPessoa.ts

import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { consultarCNPJ } from '../services/consulta-cnpj';
/**
 * Hook reutilizável para buscar dados de uma pessoa por seu documento.
 * Encapsula a lógica de consultar o banco de dados interno e, como fallback, uma API pública de CNPJ.
 *
 * @returns Um objeto contendo:
 * - `buscarPessoa`: Função assíncrona que executa a busca.
 * - `consultando`: Booleano que indica se uma busca está em andamento.
 */
/**
 * Hook para buscar informações de uma pessoa física ou jurídica pelo documento (CPF ou CNPJ).
 *
 * Funcionalidades:
 * - Realiza a busca inicialmente no banco de dados interno.
 * - Caso não encontre e o documento seja um CNPJ, faz uma consulta externa via API de CNPJ.
 * - Exibe notificações (toast) informando o status da busca.
 * - Retorna os dados padronizados para o formulário de orçamento.
 *
 * Campos retornados:
 * - `documento`: CPF ou CNPJ da pessoa.
 * - `descricao`: Nome ou razão social da pessoa.
 * - `tratamento`: Nome fantasia ou tratamento da pessoa (opcional).
 * - `estado`: UF do endereço.
 * - `codigo_ibge`: Código IBGE do município.
 * - `cep`: CEP do endereço.
 * - `bairro`: Bairro do endereço.
 * - `endereco`: Logradouro do endereço.
 * - `endereco_numero`: Número do endereço.
 * - `telefone`: Telefone principal da pessoa.
 *
 * Retorno:
 * - `buscarPessoa(doc: string)`: Função assíncrona que recebe o documento e retorna os dados da pessoa ou `null` se não encontrada.
 * - `consultando`: Estado booleano indicando se a consulta está em andamento.
 */
export const useBuscaPessoa = () => {
    const [consultando, setConsultando] = useState(false);

    const buscarPessoa = useCallback(async (doc: string) => {
        const docLimpo = doc.replace(/[^a-zA-Z0-9]/g, "");
        if (docLimpo.length !== 11 && docLimpo.length !== 14) {
            return null;
        }

        setConsultando(true);

        // 2. Se não encontrar, tenta na API de CNPJ (fallback)
        if (docLimpo.length === 14) {
            try {
                const resultado = await consultarCNPJ(docLimpo);

                console.log(resultado);

                toast.info("Pessoa encontrada em consulta externa.");
                return {
                    ds_documento: doc,
                    ds_descricao: resultado.razao_social,
                    ds_tratamento: resultado.nome_fantasia,
                    ds_estado: resultado.uf,
                    nr_codigo_ibge: resultado.codigo_municipio_ibge,
                    ds_cep: resultado.cep,
                    ds_bairro: resultado.bairro,
                    ds_endereco: `${resultado.descricao_tipo_de_logradouro} ${resultado.logradouro}`,
                    ds_endereco_numero: resultado.numero,
                    ds_telefone: resultado.ddd_telefone_1 || resultado.ddd_telefone_2,
                    ds_email: resultado.email || "",
                    ds_pais: resultado.pais || "BR",
                    ds_complemento: resultado.complemento || "",
                    dt_origem: resultado.data_inicio_atividade || new Date(),
                };
            } catch {
                toast.warn("Pessoa não encontrada em nenhuma base de dados.");
                return null;
            }
        } else {
            toast.warn("Pessoa não encontrada no sistema.");
            return null;
        }

    }, []);

    return { buscarPessoa, consultando };
};
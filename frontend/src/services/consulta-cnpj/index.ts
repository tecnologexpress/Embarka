/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API pública do site https://docs.minhareceita.org/ para consulta de CNPJ
 * 
 * TO-DO: 
 * - Implementar cache para evitar múltiplas consultas ao mesmo CNPJ em um curto período
 * - Implementar mais de uma API pública como fallback caso a principal esteja fora do ar
 * - Normalizar os dados retornados para um formato único, independente da API utilizada
 * 
 * @param cnpj string
 * @returns retorna os dados do CNPJ consultado
 */
export const consultarCNPJ = async (cnpj: string) => {
    const CNPJ_LIMPO = cnpj.replace(/[^a-zA-Z0-9]/g, '');

    if (CNPJ_LIMPO.length !== 14) {
        throw new Error("CNPJ inválido.");
    }

    try {
        const resposta = await fetch(`https://minhareceita.org/${CNPJ_LIMPO}`, {
            method: 'GET'
        });
        const dados = await resposta.json();

        return dados;
    } catch (error: any) {
        throw new Error("Erro ao consultar CNPJ: " + error.message);
    }
}

/**
 * Outras APIs públicas alternativas para consulta de CNPJ:
 * 
 * https://www.receitaws.com.br/v1/cnpj/{CNPJ} GET
 * https://api.cnpja.com.br/companies/{CNPJ} GET
 * https://www.cnpj.ws/cnpj/{CNPJ} GET
 * https://brasilapi.com.br/cnpj/v1/{CNPJ} GET
 * 
 * https://open.cnpja.com/office/{CNPJ} GET - Única que retorna dados de inscrição estadual (registrations[0].number)
 * 
 */
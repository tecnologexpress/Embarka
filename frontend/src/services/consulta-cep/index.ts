/**
 * 
 * @param cep string
 * @returns retorna os dados do CEP consultado:
 * {
  "cep": "07000-000",
  "logradouro": "Rua XYZ",
  "complemento": "",
  "unidade": "",
  "bairro": "Bairro de Exemplo",
  "localidade": "Cidade",
  "uf": "SP",
  "estado": "São Paulo",
  "regiao": "Sudeste",
  "ibge": "3518800", // Codigo do IBGE
  "gia": "3360",
  "ddd": "11",
  "siafi": "6477"
}
 */
export const consultarCep = async (prm_cep: string) => {
    // Remove caracteres não numéricos do CEP
    const cepLimpo = prm_cep.replace(/\D/g, '');

    // Verifica se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
        throw new Error("CEP inválido.");
    }

    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await resposta.json();

    // ViaCEP retorna um erro { erro: true } para CEPs não encontrados
    if (dados.erro) {
        throw new Error("CEP não encontrado.");
    }

    return dados;
}
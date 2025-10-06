/**
 * Valida CPF e CNPJ (Brasil 2026: CNPJ pode conter caracteres alfanuméricos).
 * Remove caracteres não alfanuméricos, valida dígitos verificadores.
 */

function limparDocumento(prm_doc: string): string {
    // Remove tudo exceto letras e números
    return prm_doc.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function validarCPF(prm_cpf: string): boolean {
    const CPF = limparDocumento(prm_cpf);

    if (!/^\d{11}$/.test(CPF)) return false;
    if (/^(\d)\1+$/.test(CPF)) return false; // todos iguais

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(CPF[i]) * (10 - i);
    let dig1 = (soma * 10) % 11;
    if (dig1 === 10) dig1 = 0;
    if (dig1 !== Number(CPF[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(CPF[i]) * (11 - i);
    let dig2 = (soma * 10) % 11;
    if (dig2 === 10) dig2 = 0;
    return dig2 === Number(CPF[10]);
}

/**
 * Valida um número de CNPJ (Cadastro Nacional da Pessoa Jurídica) brasileiro.
 *
 * Esta função verifica se o CNPJ informado é válido, considerando a possibilidade de conter letras (conforme previsão Brasil 2026),
 * onde as letras são convertidas para números (A=10, B=11, ..., Z=35) para o cálculo dos dígitos verificadores.
 * O CNPJ deve conter exatamente 14 caracteres alfanuméricos.
 *
 * O cálculo dos dígitos verificadores segue a regra oficial:
 * - O primeiro dígito verificador é calculado a partir dos 12 primeiros caracteres usando pesos específicos.
 * - O segundo dígito verificador é calculado a partir dos 13 primeiros caracteres (incluindo o primeiro dígito verificador) usando pesos específicos.
 *
 * @param prm_cnpj - O CNPJ a ser validado. Pode conter letras e números, mas deve ter 14 caracteres.
 * @returns `true` se o CNPJ for válido, `false` caso contrário.
 */
function validarCNPJ(prm_cnpj: string): boolean {
    const CNPJ = limparDocumento(prm_cnpj);

    // Brasil 2026: CNPJ pode conter letras, mas dígitos verificadores continuam numéricos
    if (!/^[A-Z0-9]{14}$/.test(CNPJ)) return false;

    // Para cálculo, letras são convertidas para números: A=10, B=11, ..., Z=35
    const TO_NUM = (prm_char: string) =>
        /\d/.test(prm_char) ? Number(prm_char) : prm_char.charCodeAt(0) - 55;

    const NUMS = CNPJ.split('').map(TO_NUM);

    // Dígitos verificadores são os dois últimos
    const BASE = NUMS.slice(0, 12);

    // Cálculo do primeiro dígito verificador
    let soma = 0;
    const PESOS1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
        if (BASE[i] !== undefined && PESOS1[i] !== undefined) {
            soma += BASE[i]! * PESOS1[i]!;
        } else {
            return false;
        }
    }
    let dig1 = soma % 11;
    dig1 = dig1 < 2 ? 0 : 11 - dig1;
    if (dig1 !== NUMS[12]) return false;

    // Cálculo do segundo dígito verificador
    soma = 0;
    const PESOS2 = [6, ...PESOS1];
    for (let i = 0; i < 13; i++) {
        if (NUMS[i] !== undefined && PESOS2[i] !== undefined) {
            soma += NUMS[i]! * PESOS2[i]!;
        } else {
            return false;
        }
    }
    let dig2 = soma % 11;
    dig2 = dig2 < 2 ? 0 : 11 - dig2;
    return dig2 === NUMS[13];
}

export function validarDocumento(prm_doc: string): boolean {
    const LIMPO = limparDocumento(prm_doc);
    if (LIMPO.length === 11 && /^\d+$/.test(LIMPO)) return validarCPF(LIMPO);
    if (LIMPO.length === 14 && /^[A-Z0-9]+$/.test(LIMPO)) return validarCNPJ(LIMPO);
    return false;
}
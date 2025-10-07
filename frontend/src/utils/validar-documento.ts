/**
 * Valida CNPJ, incluindo novo modelo alfanumérico (2026+).
 * @param documento string - CNPJ a ser validado
 * @returns boolean - true se válido, false caso contrário
 */
export function validarCNPJ(documento: string): boolean {
    // Remove caracteres não alfanuméricos
    const doc = documento.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Novo modelo: 14 caracteres, pode conter letras (exceto nos dígitos verificadores)
    if (doc.length !== 14) return false;

    // Se os dois últimos caracteres forem letras, inválido (dígitos verificadores devem ser numéricos)
    if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(doc)) return false;

    // Cálculo dos dígitos verificadores (modelo tradicional)
    const calcularDV = (base: string, pesos: number[]) => {
        let soma = 0;
        for (let i = 0; i < pesos.length; i++) {
            // Para letras, converter para valor numérico: A=10, B=11, ..., Z=35
            const char = base[i];
            const valor = /[A-Z]/.test(char) ? char.charCodeAt(0) - 55 : parseInt(char, 10);
            soma += valor * pesos[i];
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    // Pesos para o CNPJ tradicional (primeiro e segundo dígito)
    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // Primeiro dígito verificador
    const dv1 = calcularDV(doc.slice(0, 12), pesos1);
    // Segundo dígito verificador
    const dv2 = calcularDV(doc.slice(0, 12) + dv1, pesos2);

    // Verifica se os dígitos calculados batem com os informados
    return doc[12] === dv1.toString() && doc[13] === dv2.toString();
}
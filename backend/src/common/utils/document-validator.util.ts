/**
 * Utilitários para validação de documentos brasileiros
 * @description Funções para validar CPF e CNPJ com suporte a caracteres alfanuméricos (padrão 2026)
 */

/**
 * Remove caracteres não alfanuméricos de uma string
 * @param value - Valor a ser limpo
 * @returns String apenas com números e letras
 */
function cleanDocument(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Converte caracteres alfanuméricos para valores numéricos
 * @description A=10, B=11, ..., Z=35 conforme padrão 2026
 * @param char - Caractere a ser convertido
 * @returns Valor numérico do caractere
 */
function charToNumber(char: string): number {
  if (/[0-9]/.test(char)) {
    return parseInt(char, 10);
  }
  if (/[A-Z]/.test(char)) {
    return char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
  }
  throw new Error(`Caractere inválido: ${char}`);
}

/**
 * Valida um CPF (Cadastro de Pessoas Físicas)
 * @param cpf - CPF a ser validado (pode conter pontos, hífens e caracteres alfanuméricos)
 * @returns true se o CPF for válido, false caso contrário
 * @example
 * ```typescript
 * isValidCPF('123.456.789-09'); // true ou false
 * isValidCPF('123A56789B9'); // suporte a alfanumérico (2026+)
 * ```
 */
export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;

  const cleanCpf = cleanDocument(cpf);
  
  // CPF deve ter 11 caracteres
  if (cleanCpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(.)\1{10}$/.test(cleanCpf)) return false;

  try {
    const digits = cleanCpf.split('').map(charToNumber);

    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;

    // Verifica o primeiro dígito
    if (digits[9] !== firstDigit) return false;

    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;

    // Verifica o segundo dígito
    return digits[10] === secondDigit;
  } catch (error) {
    return false;
  }
}

/**
 * Valida um CNPJ (Cadastro Nacional de Pessoas Jurídicas)
 * @param cnpj - CNPJ a ser validado (pode conter pontos, barras, hífens e caracteres alfanuméricos)
 * @returns true se o CNPJ for válido, false caso contrário
 * @example
 * ```typescript
 * isValidCNPJ('11.222.333/0001-81'); // true ou false
 * isValidCNPJ('11A22333000181'); // suporte a alfanumérico (2026+)
 * ```
 */
export function isValidCNPJ(cnpj: string): boolean {
  if (!cnpj) return false;

  const cleanCnpj = cleanDocument(cnpj);
  
  // CNPJ deve ter 14 caracteres
  if (cleanCnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(.)\1{13}$/.test(cleanCnpj)) return false;

  try {
    const digits = cleanCnpj.split('').map(charToNumber);

    // Sequência de pesos para o primeiro dígito
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights1[i];
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;

    // Verifica o primeiro dígito
    if (digits[12] !== firstDigit) return false;

    // Sequência de pesos para o segundo dígito
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weights2[i];
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;

    // Verifica o segundo dígito
    return digits[13] === secondDigit;
  } catch (error) {
    return false;
  }
}

/**
 * Identifica o tipo de documento baseado no formato
 * @param document - Documento a ser identificado
 * @returns 'CPF', 'CNPJ' ou null se não for possível identificar
 * @example
 * ```typescript
 * getDocumentType('123.456.789-09'); // 'CPF'
 * getDocumentType('11.222.333/0001-81'); // 'CNPJ'
 * ```
 */
export function getDocumentType(document: string): 'CPF' | 'CNPJ' | null {
  if (!document) return null;

  const cleanDoc = cleanDocument(document);
  
  if (cleanDoc.length === 11) return 'CPF';
  if (cleanDoc.length === 14) return 'CNPJ';
  
  return null;
}

/**
 * Valida um documento (CPF ou CNPJ) automaticamente
 * @param document - Documento a ser validado
 * @returns true se o documento for válido, false caso contrário
 * @example
 * ```typescript
 * isValidDocument('123.456.789-09'); // valida como CPF
 * isValidDocument('11.222.333/0001-81'); // valida como CNPJ
 * ```
 */
export function isValidDocument(document: string): boolean {
  const type = getDocumentType(document);
  
  switch (type) {
    case 'CPF':
      return isValidCPF(document);
    case 'CNPJ':
      return isValidCNPJ(document);
    default:
      return false;
  }
}

/**
 * Formata um documento brasileiro
 * @param document - Documento a ser formatado
 * @returns Documento formatado ou string original se inválido
 * @example
 * ```typescript
 * formatDocument('12345678909'); // '123.456.789-09'
 * formatDocument('11222333000181'); // '11.222.333/0001-81'
 * ```
 */
export function formatDocument(document: string): string {
  if (!document) return document;

  const cleanDoc = cleanDocument(document);
  const type = getDocumentType(cleanDoc);

  switch (type) {
    case 'CPF':
      if (cleanDoc.length === 11) {
        return cleanDoc.replace(/(\w{3})(\w{3})(\w{3})(\w{2})/, '$1.$2.$3-$4');
      }
      break;
    case 'CNPJ':
      if (cleanDoc.length === 14) {
        return cleanDoc.replace(/(\w{2})(\w{3})(\w{3})(\w{4})(\w{2})/, '$1.$2.$3/$4-$5');
      }
      break;
  }

  return document;
}
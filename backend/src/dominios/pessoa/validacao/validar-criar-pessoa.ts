/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from "express";
import {
    checkSchema,
    Schema,
    validationResult,
    ValidationError,
    FieldValidationError,
} from "express-validator";

/** helpers de sanitização */
const somenteDigitos = (v: string) => (v ?? "").replace(/\D+/g, "");
const somenteAlfanumericoMaiusculo = (v: string) =>
    (v ?? "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

/** schema do body { data: CriarPessoaDto, senha: string } */
/**
 * Esquema de validação para criação de pessoa jurídica.
 *
 * Este schema define as regras de validação para os campos necessários ao criar uma pessoa jurídica,
 * incluindo validações de formato, obrigatoriedade, tamanho e sanitização de dados.
 *
 * Campos validados:
 * - senha: Senha do usuário, obrigatória, mínimo 8 caracteres, deve conter minúscula, maiúscula, número e caractere especial.
 * - data.ds_documento: Documento (CNPJ), obrigatório, 14 caracteres alfanuméricos.
 * - data.ds_descricao: Razão social, obrigatória, entre 2 e 50 caracteres.
 * - data.ds_tratamento: Nome fantasia, opcional, até 50 caracteres.
 * - data.dt_origem: Data de abertura, obrigatória, formato ISO8601.
 * - data.ds_email: Email, obrigatório, formato válido.
 * - data.ds_telefone: Telefone, obrigatório, 10 ou 11 dígitos.
 * - data.ds_celular: Celular, opcional, 11 dígitos.
 * - data.ds_pais: País, obrigatório, entre 2 e 30 caracteres.
 * - data.ds_estado: UF, obrigatória, exatamente 2 caracteres.
 * - data.nr_codigo_ibge: Código IBGE, obrigatório, inteiro maior que 0.
 * - data.ds_bairro: Bairro, obrigatório, entre 2 e 30 caracteres.
 * - data.ds_cep: CEP, obrigatório, 8 dígitos.
 * - data.ds_endereco: Endereço, obrigatório, entre 2 e 30 caracteres.
 * - data.ds_endereco_numero: Número do endereço, obrigatório, entre 1 e 10 caracteres, apenas caracteres válidos.
 * - data.ds_complemento: Complemento, opcional, até 50 caracteres.
 * - data.ds_site: Site, opcional, URL válida com protocolo.
 * - data.ds_instagram: Instagram, opcional, até 30 caracteres.
 * - data.ds_linkedin: LinkedIn, opcional, até 30 caracteres.
 * - data.ds_twitter: Twitter, opcional, até 30 caracteres.
 * - data.ds_facebook: Facebook, opcional, até 30 caracteres.
 * - data.ds_inscricao_estadual: Inscrição estadual, opcional, texto livre.
 *
 * Funções auxiliares utilizadas:
 * - somenteAlfanumericoMaiusculo: Sanitiza o documento para conter apenas caracteres alfanuméricos maiúsculos.
 * - somenteDigitos: Sanitiza campos para conter apenas dígitos numéricos.
 *
 * @see somenteAlfanumericoMaiusculo
 * @see somenteDigitos
 */
const schemaCriarPessoa: Schema = {
    senha: {
        in: ["body"],
        exists: { errorMessage: "Senha é obrigatória" },
        isString: { errorMessage: "Senha deve ser um texto" },
        trim: true,
        isLength: {
            options: { min: 8 },
            errorMessage: "Senha deve ter pelo menos 8 caracteres",
        },
        matches: {
            options: [/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}/],
            errorMessage:
                "Senha deve conter minúscula, maiúscula, número e caractere especial",
        },
    },

    "data.ds_documento": {
        in: ["body"],
        exists: { errorMessage: "Documento (CNPJ) é obrigatório" },
        isString: { errorMessage: "Documento deve ser texto" },
        customSanitizer: { options: (v: string) => somenteAlfanumericoMaiusculo(v) },
        isLength: {
            options: { min: 14, max: 14 },
            errorMessage: "CNPJ deve conter 14 caracteres alfanuméricos",
        },
    },

    "data.ds_descricao": {
        in: ["body"],
        exists: { errorMessage: "Razão social é obrigatória" },
        isString: { errorMessage: "Razão social deve ser texto" },
        trim: true,
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: "Razão social deve ter entre 2 e 50 caracteres",
        },
    },

    "data.ds_tratamento": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Nome fantasia deve ser texto" },
        trim: true,
        isLength: {
            options: { max: 50 },
            errorMessage: "Nome fantasia deve ter no máximo 50 caracteres",
        },
    },

    "data.dt_origem": {
        in: ["body"],
        exists: { errorMessage: "Data de abertura é obrigatória" },
        isISO8601: { errorMessage: "Data de abertura inválida" },
        toDate: true,
    },

    "data.ds_email": {
        in: ["body"],
        exists: { errorMessage: "Email é obrigatório" },
        isString: { errorMessage: "Email deve ser texto" },
        trim: true,
        isEmail: { errorMessage: "Email inválido" },
        normalizeEmail: true,
    },

    "data.ds_telefone": {
        in: ["body"],
        exists: { errorMessage: "Telefone é obrigatório" },
        isString: { errorMessage: "Telefone deve ser texto" },
        customSanitizer: { options: (v: string) => somenteDigitos(v) },
        isLength: {
            options: { min: 10, max: 11 },
            errorMessage: "Telefone deve conter 10 ou 11 dígitos",
        },
    },

    "data.ds_celular": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Celular deve ser texto" },
        customSanitizer: { options: (v: string) => somenteDigitos(v) },
        isLength: {
            options: { min: 11, max: 11 },
            errorMessage: "Celular deve conter 11 dígitos",
        },
    },

    "data.ds_pais": {
        in: ["body"],
        exists: { errorMessage: "País é obrigatório" },
        isString: { errorMessage: "País deve ser texto" },
        trim: true,
        isLength: {
            options: { min: 2, max: 30 },
            errorMessage: "País deve ter entre 2 e 30 caracteres",
        },
    },

    "data.ds_estado": {
        in: ["body"],
        exists: { errorMessage: "UF é obrigatória" },
        isString: { errorMessage: "UF deve ser texto" },
        customSanitizer: { options: (v: string) => String(v ?? "").toUpperCase().trim() },
        isLength: {
            options: { min: 2, max: 2 },
            errorMessage: "UF deve conter exatamente 2 caracteres",
        },
    },

    "data.nr_codigo_ibge": {
        in: ["body"],
        exists: { errorMessage: "Código IBGE é obrigatório" },
        toInt: true,
        isInt: { options: { min: 1 }, errorMessage: "Código IBGE deve ser inteiro válido" },
    },

    "data.ds_bairro": {
        in: ["body"],
        exists: { errorMessage: "Bairro é obrigatório" },
        isString: { errorMessage: "Bairro deve ser texto" },
        trim: true,
        isLength: {
            options: { min: 2, max: 30 },
            errorMessage: "Bairro deve ter entre 2 e 30 caracteres",
        },
    },

    "data.ds_cep": {
        in: ["body"],
        exists: { errorMessage: "CEP é obrigatório" },
        customSanitizer: { options: (v: string | number) => somenteDigitos(String(v ?? "")) },
        isLength: { options: { min: 8, max: 8 }, errorMessage: "CEP deve conter 8 dígitos" },
        toInt: true,
    },

    "data.ds_endereco": {
        in: ["body"],
        exists: { errorMessage: "Endereço é obrigatório" },
        isString: { errorMessage: "Endereço deve ser texto" },
        trim: true,
        isLength: {
            options: { min: 2, max: 30 },
            errorMessage: "Endereço deve ter entre 2 e 30 caracteres",
        },
    },

    "data.ds_endereco_numero": {
        in: ["body"],
        exists: { errorMessage: "Número do endereço é obrigatório" },
        isString: { errorMessage: "Número do endereço deve ser texto" },
        trim: true,
        isLength: { options: { min: 1, max: 10 }, errorMessage: "Número inválido (1–10 chars)" },
        matches: {
            // eslint-disable-next-line no-useless-escape
            options: [/^[0-9a-zA-Z\-\/\s]+$/],
            errorMessage: "Número do endereço possui caracteres inválidos",
        },
    },

    "data.ds_complemento": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Complemento deve ser texto" },
        trim: true,
        isLength: { options: { max: 50 }, errorMessage: "Complemento até 50 caracteres" },
    },

    "data.ds_site": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Site deve ser texto" },
        trim: true,
        isURL: {
            options: { require_protocol: true },
            errorMessage: "Site deve ser URL válida (inclua http/https)",
        },
    },

    "data.ds_instagram": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Instagram deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "Instagram até 30 caracteres" },
    },
    "data.ds_linkedin": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "LinkedIn deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "LinkedIn até 30 caracteres" },
    },
    "data.ds_twitter": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Twitter deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "Twitter até 30 caracteres" },
    },
    "data.ds_facebook": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Facebook deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "Facebook até 30 caracteres" },
    },

    "data.ds_inscricao_estadual": {
        in: ["body"],
        optional: { options: { nullable: true } },
        isString: { errorMessage: "Inscrição estadual deve ser texto" },
        trim: true,
    },
};

/** type guard para filtrar erros de campo (v7) */
function isFieldError(e: ValidationError): e is FieldValidationError {
    return (e as FieldValidationError).type === "field";
}

/** middleware final que aplica o schema e responde 422 se houver erros */
export const validarCriarPessoa = [
    ...checkSchema(schemaCriarPessoa),

    (req: Request, res: Response, next: NextFunction) => {
        const resultado = validationResult(req);

        if (resultado.isEmpty()) {
            return next();
        }

        // v7 → usar path (não param) e filtrar por type === 'field'
        const erros = resultado
            .array({ onlyFirstError: true })
            .filter(isFieldError)
            .map((e) => ({
                campo: e.path,                  // <— era param
                mensagem: String(e.msg),
                valor: e.value,
                local: e.location,              // opcional: body, query, params
            }));

        return res.status(422).json({
            success: false,
            message: "Falha de validação dos dados enviados",
            errors: erros,
        });
    },
];

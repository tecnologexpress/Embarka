/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from "express";
import {
    checkSchema, Schema, validationResult, ValidationError, FieldValidationError,
} from "express-validator";

const somenteDigitos = (v: string) => (String(v ?? "")).replace(/\D+/g, "");
const somenteAlfanumericoMaiusculo = (v: string) =>
    (String(v ?? "")).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

const CNPJ_BR2026_REGEX = /^[A-Z0-9]{14}$/;

const schemaCriarPessoa: Schema = {
    senha: {
        in: ["body"],
        exists: { errorMessage: "Senha é obrigatória" },
        isString: { errorMessage: "Senha deve ser um texto" },
        trim: true,
        isLength: { options: { min: 8 }, errorMessage: "Senha deve ter pelo menos 8 caracteres" },
        matches: {
            options: [/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}/],
            errorMessage: "Senha deve conter minúscula, maiúscula, número e caractere especial",
        },
    },

    role: {
        in: ["body"],
        exists: { errorMessage: "Role é obrigatória" },
        customSanitizer: { options: (v: string) => String(v).toUpperCase().trim() },
        isIn: {
            options: [["FORNECEDOR", "CLIENTE", "EMBARCADOR", "TRANSPORTADORA"]],
            errorMessage: "Role inválida",
        },
    },

    ds_documento: {
        in: ["body"],
        exists: { errorMessage: "Documento (CNPJ) é obrigatório" },
        isString: { errorMessage: "Documento deve ser texto" },
        customSanitizer: { options: (v: string) => somenteAlfanumericoMaiusculo(v) },
        isLength: { options: { min: 14, max: 14 }, errorMessage: "CNPJ deve conter exatamente 14 caracteres" },
        matches: {
            options: [CNPJ_BR2026_REGEX],
            errorMessage: "CNPJ deve conter apenas letras (A-Z) e números (0-9)",
        },
    },

    ds_descricao: {
        in: ["body"],
        exists: { errorMessage: "Razão social é obrigatória" },
        isString: { errorMessage: "Razão social deve ser texto" },
        trim: true,
        isLength: { options: { min: 2, max: 50 }, errorMessage: "Razão social deve ter entre 2 e 50 caracteres" },
    },

    ds_tratamento: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: { errorMessage: "Nome fantasia deve ser texto" },
        trim: true,
        isLength: { options: { max: 50 }, errorMessage: "Nome fantasia deve ter no máximo 50 caracteres" },
    },

    dt_origem: {
        in: ["body"],
        exists: { errorMessage: "Data de abertura é obrigatória" },
        // aceita Date ou string
        customSanitizer: {
            options: (v: unknown) => {
                if (v instanceof Date && !isNaN(v.valueOf())) return v.toISOString().slice(0, 10);
                const s = String(v ?? "");
                // se vier "YYYY-MM-DDTHH:mm:ssZ", reduz para "YYYY-MM-DD"
                const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
                return m ? m[1] : s;
            },
        },
        isISO8601: { options: { strict: true }, errorMessage: "Data de abertura inválida (YYYY-MM-DD)" },
        toDate: true,
    },

    ds_email: {
        in: ["body"],
        exists: { errorMessage: "Email é obrigatório" },
        isString: { errorMessage: "Email deve ser texto" },
        isEmail: { errorMessage: "Email inválido" },
    },

    ds_telefone: {
        in: ["body"],
        exists: { errorMessage: "Telefone é obrigatório" },
        isString: { errorMessage: "Telefone deve ser texto" },
        customSanitizer: { options: (v: string) => somenteDigitos(v) },
        isLength: { options: { min: 10, max: 11 }, errorMessage: "Telefone deve conter 10 ou 11 dígitos" },
    },

    ds_celular: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: { errorMessage: "Celular deve ser texto" },
        customSanitizer: { options: (v: string) => somenteDigitos(v) },
        isLength: { options: { min: 11, max: 11 }, errorMessage: "Celular deve conter 11 dígitos" },
    },

    ds_pais: {
        in: ["body"],
        exists: { errorMessage: "País é obrigatório" },
        isString: { errorMessage: "País deve ser texto" },
        trim: true,
        isLength: { options: { min: 2, max: 30 }, errorMessage: "País deve ter entre 2 e 30 caracteres" },
    },

    ds_estado: {
        in: ["body"],
        exists: { errorMessage: "UF é obrigatória" },
        isString: { errorMessage: "UF deve ser texto" },
        customSanitizer: { options: (v: string) => String(v ?? "").toUpperCase().trim() },
        isLength: { options: { min: 2, max: 2 }, errorMessage: "UF deve conter exatamente 2 caracteres" },
    },

    nr_codigo_ibge: {
        in: ["body"],
        exists: { errorMessage: "Código IBGE é obrigatório" },
        toInt: true,
        isInt: { options: { min: 1 }, errorMessage: "Código IBGE deve ser inteiro válido" },
    },

    ds_bairro: {
        in: ["body"],
        exists: { errorMessage: "Bairro é obrigatório" },
        isString: { errorMessage: "Bairro deve ser texto" },
        trim: true,
        isLength: { options: { min: 2, max: 50 }, errorMessage: "Bairro deve ter entre 2 e 60 caracteres" },
    },

    ds_cep: {
        in: ["body"],
        exists: { errorMessage: "CEP é obrigatório" },
        customSanitizer: { options: (v: string | number) => somenteDigitos(String(v ?? "")) },
        isLength: { options: { min: 8, max: 8 }, errorMessage: "CEP deve conter 8 dígitos" },
    },

    ds_endereco: {
        in: ["body"],
        exists: { errorMessage: "Endereço é obrigatório" },
        isString: { errorMessage: "Endereço deve ser texto" },
        trim: true,
        isLength: { options: { min: 2, max: 30 }, errorMessage: "Endereço deve ter entre 2 e 30 caracteres" },
    },

    ds_endereco_numero: {
        in: ["body"],
        exists: { errorMessage: "Número do endereço é obrigatório" },
        isString: { errorMessage: "Número do endereço deve ser texto" },
        trim: true,
        isLength: { options: { min: 1, max: 10 }, errorMessage: "Número inválido (1-10 chars)" },
        // eslint-disable-next-line no-useless-escape
        matches: { options: [/^[0-9A-Za-z\-\/\s]+$/], errorMessage: "Número do endereço possui caracteres inválidos" },
    },

    ds_complemento: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: { errorMessage: "Complemento deve ser texto" },
        trim: true,
        isLength: { options: { max: 50 }, errorMessage: "Complemento até 50 caracteres" },
    },

    ds_site: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } }, // <- evita validar "" como URL
        isString: { errorMessage: "Site deve ser texto" },
        trim: true,
        isURL: {
            options: { require_protocol: true },
            errorMessage: "Site deve ser URL válida (inclua http/https)",
        },
    },

    ds_instagram: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: { errorMessage: "Instagram deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "Instagram até 30 caracteres" },
    },

    ds_linkedin: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: { errorMessage: "LinkedIn deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "LinkedIn até 30 caracteres" },
    },

    ds_twitter: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: { errorMessage: "Twitter deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "Twitter até 30 caracteres" },
    },

    ds_facebook: {
        in: ["body"],
        optional: { options: { nullable: true, checkFalsy: true } },
        isString: { errorMessage: "Facebook deve ser texto" },
        trim: true,
        isLength: { options: { max: 30 }, errorMessage: "Facebook até 30 caracteres" },
    },
};

function isFieldError(e: ValidationError): e is FieldValidationError {
    return (e as FieldValidationError).type === "field";
}

export const validarCriarPessoa = [
    ...checkSchema(schemaCriarPessoa),
    (req: Request, res: Response, next: NextFunction) => {
        const resultado = validationResult(req);
        if (resultado.isEmpty()) return next();

        const errors = resultado
            .array({ onlyFirstError: true })
            .filter(isFieldError)
            .map((e) => ({ campo: e.path, mensagem: String(e.msg), valor: e.value, local: e.location }));

        return res.status(422).json({
            success: false,
            message: "Falha de validação dos dados enviados",
            errors,
        });
    },
];

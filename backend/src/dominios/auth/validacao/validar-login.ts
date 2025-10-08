/* eslint-disable @typescript-eslint/naming-convention */
import { NextFunction, Request, Response } from "express";
import {
    checkSchema,
    Schema,
    validationResult,
    ValidationError,
    FieldValidationError,
} from "express-validator";

const schemaLogin: Schema = {
    email: {
        in: ["body"],
        exists: { errorMessage: "Email é obrigatório" },
        isEmail: { errorMessage: "Email inválido" },
        normalizeEmail: true,
        trim: true,
        isLength: {
            options: { min: 5, max: 100 },
            errorMessage: "Email deve ter entre 5 e 100 caracteres",
        },
    },
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
};

/** type guard para filtrar erros de campo (v7) */
function isFieldError(e: ValidationError): e is FieldValidationError {
    return (e as FieldValidationError).type === "field";
}

/** middleware final que aplica o schema e responde 422 se houver erros */
export const validarLogin = [
    ...checkSchema(schemaLogin),

    (req: Request, res: Response, next: NextFunction) => {
        const resultado = validationResult(req);

        if (resultado.isEmpty()) {
            return next();
        }

        const erros = resultado
            .array({ onlyFirstError: true })
            .filter(isFieldError)
            .map((e) => ({
                campo: e.path,
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

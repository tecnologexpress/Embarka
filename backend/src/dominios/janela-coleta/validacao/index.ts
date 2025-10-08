import { body, param, ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const HORA_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/; // HH:mm(:ss)
const DIAS = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"] as const;

function toSec(prm_h: string): number {
    const [HH_RAW, MM_RAW, SS_RAW = "00"] = String(prm_h).split(":");
    const HH = Number(HH_RAW);
    const MM = Number(MM_RAW);
    const SS = Number(SS_RAW);

    // fallback to 0 if any part is missing or not a number
    const SAFE_HH = isNaN(HH) ? 0 : HH;
    const SAFE_MM = isNaN(MM) ? 0 : MM;
    const SAFE_SS = isNaN(SS) ? 0 : SS;

    return SAFE_HH * 3600 + SAFE_MM * 60 + SAFE_SS;
}

// ---------- middlewares de validação ----------

export const VALIDAR_CRIAR_GRADE: ValidationChain[] = [
    body("ds_dia_da_semana")
        .exists({ checkFalsy: true }).withMessage("Dia da semana é obrigatório")
        .bail()
        .customSanitizer((prm_v) => String(prm_v).trim().toUpperCase())
        .isIn(DIAS as unknown as string[]).withMessage("Dia da semana inválido"),

    body("hr_horario_inicio")
        .exists({ checkFalsy: true }).withMessage("Horário inicial é obrigatório")
        .bail()
        .matches(HORA_REGEX).withMessage("Horário inicial inválido (HH:mm ou HH:mm:ss)"),

    body("hr_horario_fim")
        .exists({ checkFalsy: true }).withMessage("Horário final é obrigatório")
        .bail()
        .matches(HORA_REGEX).withMessage("Horário final inválido (HH:mm ou HH:mm:ss)"),

    // validações do intervalo (opcional)
    body("hr_intervalo_inicio")
        .optional({ nullable: true })
        .matches(HORA_REGEX).withMessage("Horário de início do intervalo inválido (HH:mm ou HH:mm:ss)"),

    body("hr_intervalo_fim")
        .optional({ nullable: true })
        .matches(HORA_REGEX).withMessage("Horário de fim do intervalo inválido (HH:mm ou HH:mm:ss)"),

    // validações cruzadas
    body(["hr_horario_inicio", "hr_horario_fim"]).custom((prm_unused, { req }) => {
        const INI = req.body.hr_horario_inicio;
        const FIM = req.body.hr_horario_fim;
        if (HORA_REGEX.test(INI) && HORA_REGEX.test(FIM)) {
            if (toSec(INI) >= toSec(FIM)) {
                throw new Error("O horário inicial deve ser menor que o horário final");
            }
        }
        return true;
    }),

    body(["hr_intervalo_inicio", "hr_intervalo_fim"]).custom((prm_unused, { req }) => {
        const IV_INI = req.body.hr_intervalo_inicio;
        const IV_FIM = req.body.hr_intervalo_fim;

        // se um veio, o outro é obrigatório
        if ((IV_INI && !IV_FIM) || (!IV_INI && IV_FIM)) {
            throw new Error("Para intervalo, informe os dois campos (início e fim)");
        }

        if (IV_INI && IV_FIM && HORA_REGEX.test(IV_INI) && HORA_REGEX.test(IV_FIM)) {
            if (toSec(IV_INI) >= toSec(IV_FIM)) {
                throw new Error("O início do intervalo deve ser menor que o fim do intervalo");
            }

            // intervalo contido na janela principal
            const WIN_INI = req.body.hr_horario_inicio;
            const WIN_FIM = req.body.hr_horario_fim;
            if (HORA_REGEX.test(WIN_INI) && HORA_REGEX.test(WIN_FIM)) {
                if (!(toSec(WIN_INI) < toSec(IV_INI) && toSec(IV_FIM) < toSec(WIN_FIM))) {
                    throw new Error("O intervalo deve estar contido dentro da janela principal");
                }
            }
        }
        return true;
    }),
];

export const VALIDAR_ATUALIZAR_GRADE: ValidationChain[] = [
    body("id_janela_de_coleta").isInt({ gt: 0 }).withMessage("ID inválido"),
    body("ds_dia_da_semana")
        .optional()
        .customSanitizer((prm_v) => String(prm_v).trim().toUpperCase())
        .isIn(DIAS as unknown as string[]).withMessage("Dia da semana inválido"),

    body("hr_horario_inicio")
        .optional({ nullable: true })
        .matches(HORA_REGEX).withMessage("Horário inicial inválido (HH:mm ou HH:mm:ss)"),

    body("hr_horario_fim")
        .optional({ nullable: true })
        .matches(HORA_REGEX).withMessage("Horário final inválido (HH:mm ou HH:mm:ss)"),

    body("hr_intervalo_inicio")
        .optional({ nullable: true })
        .matches(HORA_REGEX).withMessage("Horário de início do intervalo inválido (HH:mm ou HH:mm:ss)"),

    body("hr_intervalo_fim")
        .optional({ nullable: true })
        .matches(HORA_REGEX).withMessage("Horário de fim do intervalo inválido (HH:mm ou HH:mm:ss)"),

    // validações cruzadas quando os campos forem enviados
    body(["hr_horario_inicio", "hr_horario_fim"]).custom((prm_unused, { req }) => {
        const INI = req.body.hr_horario_inicio;
        const FIM = req.body.hr_horario_fim;
        if (INI && FIM && HORA_REGEX.test(INI) && HORA_REGEX.test(FIM)) {
            if (toSec(INI) >= toSec(FIM)) {
                throw new Error("O horário inicial deve ser menor que o horário final");
            }
        }
        return true;
    }),

    body(["hr_intervalo_inicio", "hr_intervalo_fim"]).custom((prm_unused, { req }) => {
        const IV_INI = req.body.hr_intervalo_inicio;
        const IV_FIM = req.body.hr_intervalo_fim;
        if ((IV_INI && !IV_FIM) || (!IV_INI && IV_FIM)) {
            throw new Error("Para intervalo, informe os dois campos (início e fim)");
        }
        if (IV_INI && IV_FIM && HORA_REGEX.test(IV_INI) && HORA_REGEX.test(IV_FIM)) {
            if (toSec(IV_INI) >= toSec(IV_FIM)) {
                throw new Error("O início do intervalo deve ser menor que o fim do intervalo");
            }
            const WIN_INI = req.body.hr_horario_inicio;
            const WIN_FIM = req.body.hr_horario_fim;
            if (WIN_INI && WIN_FIM && HORA_REGEX.test(WIN_INI) && HORA_REGEX.test(WIN_FIM)) {
                if (!(toSec(WIN_INI) < toSec(IV_INI) && toSec(IV_FIM) < toSec(WIN_FIM))) {
                    throw new Error("O intervalo deve estar contido dentro da janela principal");
                }
            }
        }
        return true;
    }),
];

export const VALIDAR_PARAM_FORNECEDOR: ValidationChain[] = [
    param("id_fornecedor").isInt({ gt: 0 }).withMessage("id_fornecedor inválido"),
];

// ---------- coletor de erros ----------
export function coletarErros(req: Request, res: Response, next: NextFunction) {
    const RESULT = validationResult(req);
    if (RESULT.isEmpty()) return next();

    const ERROS = RESULT.array().map((prm_e: any) => ({
        campo: prm_e.param ?? prm_e.type ?? "param",
        mensagem: prm_e.msg,
        valor: prm_e.value,
    }));

    return res.status(422).json({
        success: false,
        message: "Falha de validação dos dados enviados",
        erros: ERROS,
    });
}

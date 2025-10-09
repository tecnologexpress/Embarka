import rateLimit from "express-rate-limit";

export const LIMITAR_SOLICITACAO_RECUPERACAO = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 5,                  // 5 tentativas por janela
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        const EMAIL_USUARIO = (req.body?.email || "").toLowerCase().trim();
        const IP_USUARIO = (req.headers["x-forwarded-for"] as string) || req.ip || "ip";
        return `${IP_USUARIO}:${EMAIL_USUARIO}`;
    },
});

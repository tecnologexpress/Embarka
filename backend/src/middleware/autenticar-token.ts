import { obterClienteIP } from '@/utils/obter-ip';
import { PayloadToken } from '@/utils/token-jwt';
import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export interface RequestAutenticado extends Request {
    token?: PayloadToken;
}

/**
 * Middleware para autenticação de token JWT.
 *
 * Este middleware verifica se o token JWT está presente nos cookies da requisição.
 * Se o token estiver ausente ou inválido, retorna erro 403 com detalhes.
 * Se o token for válido, adiciona as informações decodificadas à requisição.
 *
 * Interfaces:
 * - RequestAutenticado: Extende Request do Express, adicionando a propriedade opcional 'token' do tipo PayloadToken.
 *
 * Parâmetros:
 * @param req - Objeto de requisição do Express, estendido com:
 *   - token?: PayloadToken - Dados decodificados do token JWT.
 *   - cookies.token - Token JWT enviado via cookie.
 * @param res - Objeto de resposta do Express.
 * @param next - Função para passar ao próximo middleware.
 *
 * Fluxo:
 * 1. Verifica se JWT_SECRET está definido; lança erro se não estiver.
 * 2. Busca o token JWT nos cookies.
 * 3. Se o token estiver presente, tenta validar e decodificar usando jwt.verify.
 *    - Se válido, adiciona dados ao req.token e chama next().
 * 4. Se o token estiver ausente ou inválido:
 *    - Retorna status 403 e mensagem de erro detalhada.
 *
 * Exceções:
 * - Lança erro se JWT_SECRET não estiver definido.
 * - Retorna erro 403 se o token não for fornecido ou for inválido.
 */
export function autenticarToken(
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
): void {
    const JWT_SECRET = process.env.JWT_SECRET || '';
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET não está definido no ambiente');
    }

    // 1) pegar token do cookie OU Authorization: Bearer
    const COOKIE_TOKEN = req.cookies?.token as string | undefined;
    const AUTH_HEADER = req.header("authorization") || req.header("Authorization");
    const BEARER_TOKEN = AUTH_HEADER?.startsWith("Bearer ")
        ? AUTH_HEADER.slice(7).trim()
        : undefined;

    const TOKEN = COOKIE_TOKEN || BEARER_TOKEN;

    if (!TOKEN) {
        res.status(401).json({ error: "Token não fornecido." });
        return;
    }

    try {
        // 2) verificar token
        const DECODIFICADO = jwt.verify(TOKEN, JWT_SECRET) as PayloadToken;

        // 3) anexar ao request SEM checar req.token (pois está undefined)
        req.token = {
            ...DECODIFICADO,
            usuario_ip: obterClienteIP(req),
        };

        return next();
    } catch (err) {
        const ERRO = err as Error;
        let detail = "Erro interno ao validar o token.";
        if (ERRO instanceof TokenExpiredError) {
            detail = "O token expirou. Faça login novamente.";
        } else if (ERRO instanceof JsonWebTokenError) {
            detail = "Token malformado ou assinatura inválida.";
        }
        res.status(401).json({ error: "Token inválido ou expirado.", detail });
    }
}
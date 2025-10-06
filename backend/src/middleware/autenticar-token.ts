import { PayloadToken } from '@/infraestrutura/token';
import { ObterClienteIP } from '@/utils/obter-ip';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

    const COOKIE_TOKEN = req.cookies?.token;
    const TOKEN = COOKIE_TOKEN; // || bearerToken;

    // Captura o IP do cliente
    if (req.token) {
        req.token.usuario_ip = ObterClienteIP(req);
    }

    if (!TOKEN) {
        res.status(403).json({ error: 'Token não fornecido.' });
        return;
    }

    try {
        const DECODIFICADO = jwt.verify(TOKEN, JWT_SECRET) as PayloadToken;
        if (req.token) {
            req.token.username = DECODIFICADO.username;
            req.token.usuario_ip = DECODIFICADO.usuario_ip;
        }
        next();
    } catch (err: any) {
        console.error('Falha na verificação do token:', err);

        const MESSAGE = 'Token inválido ou expirado.';
        let detail = '';

        if (err instanceof jwt.TokenExpiredError) {
            detail = 'O token expirou. Faça login novamente para renovar.';
        } else if (err instanceof jwt.JsonWebTokenError) {
            detail = 'O token fornecido é malformado ou não foi assinado corretamente.';
        } else {
            detail = 'Erro interno ao validar o token.';
        }

        res.status(403).json({ error: MESSAGE, detail });
    }
}
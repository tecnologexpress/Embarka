import { HttpErro } from '@/infraestrutura/erros/http-error';
import { Request, Response, NextFunction } from 'express';

/**
 * Manipula erros lançados durante o processamento das requisições.
 *
 * @param prm_erro - O erro lançado, pode ser uma instância de HttpErro ou outro tipo de erro.
 * @param _prm_req - O objeto da requisição Express (não utilizado).
 * @param prm_res - O objeto de resposta Express, utilizado para enviar a resposta ao cliente.
 * @param _prm_next - A função next do Express (não utilizada).
 *
 * @remarks
 * Se o erro for uma instância de HttpErro, retorna o status e a mensagem do erro.
 * Caso contrário, registra o erro no console e retorna um erro genérico 500.
 */
export const HandlerDeErros = (prm_erro: any, _prm_req: Request, prm_res: Response, _prm_next: NextFunction) => {
    if (prm_erro instanceof HttpErro) {
        return prm_res.status(prm_erro.status).json({ error: prm_erro.message });
    }

    console.error('[Erro não tratado]', prm_erro);
    return prm_res.status(500).json({ error: 'Erro interno do servidor' });
};
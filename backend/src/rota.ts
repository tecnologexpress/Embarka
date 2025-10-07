import { Express } from 'express';
import AUTH_ROTA from '@/dominios/auth/rota/rota';
import PESSOA_ROTA from '@/dominios/pessoa/rota';
import MUNICIPIO_ROTA from '@/dominios/municipio/rota';
import ESTADO_ROTA from '@/dominios/estado/rota';
import FORNECEDOR_ROTA from '@/dominios/fornecedor/rota';

/**
 * Configura todas as rotas da aplicação
 * @param prm_app - Instância do Express
 */
export const CONFIGURAR_ROTAS = (prm_app: Express): void => {

    // Rotas de pessoa
    prm_app.use('/pessoa', PESSOA_ROTA);
    // Rotas de fornecedor
    prm_app.use('/fornecedor', FORNECEDOR_ROTA);
    // Rotas de autenticação
    prm_app.use('/auth', AUTH_ROTA);
    // Rotas de município
    prm_app.use('/municipio', MUNICIPIO_ROTA);
    // Rotas de estado
    prm_app.use('/estado', ESTADO_ROTA);

    // Rota para endpoints não encontrados (404)
    prm_app.all('*', (prm_req, prm_res) => {
        prm_res.status(404).json({
            sucesso: false,
            mensagem: `Rota ${prm_req.originalUrl} não encontrada`,
            timestamp: new Date().toISOString()
        });
    });
};
import { Request, Response } from 'express';
import { ServicoNaturezaJuridica } from './servico';
import { TratarErro } from '@/infraestrutura/erros/tratar-erro';

export class ControladorNaturezaJuridica {
    constructor(
        private readonly servicoNaturezaJuridica: ServicoNaturezaJuridica,
    ) { }

    /**
     * GET /natureza-juridica/pessoas/:descricao
     * Lista pessoas por natureza jurídica ('fisica' ou 'juridica').
     */
    buscarPessoasPorNatureza = async (req: Request, res: Response) => {
        try {
            const { DESCRICAO } = req.params;
            const RESULTADO = await this.servicoNaturezaJuridica.buscarPessoasPorNatureza(DESCRICAO as 'fisica' | 'juridica');
            res.json(RESULTADO);
        } catch (erro: any) {
            TratarErro(res, erro, "Erro ao filtrar pessoas por natureza jurídica");
        }
    };
}
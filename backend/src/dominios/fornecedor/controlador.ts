import { Request, Response } from 'express';
import { FornecedorServico } from './servico';

export class FornecedorControlador {
    constructor(
        private readonly fornecedorServico: FornecedorServico
    ) { }

    async listarFornecedores(req: Request, res: Response): Promise<void> {
        try {
            const FORNECEDORES = await this.fornecedorServico.listarFornecedores();
            res.json(FORNECEDORES);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao listar fornecedores.' });
        }
    }

    async buscarFornecedorPorId(req: Request, res: Response): Promise<void> {
        try {
            const ID = Number(req.params.id);
            const FORNECEDOR = await this.fornecedorServico.buscarFornecedorPorId(ID);
            if (FORNECEDOR) {
                res.json(FORNECEDOR);
            } else {
                res.status(404).json({ mensagem: 'Fornecedor não encontrado.' });
            }
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar fornecedor.' });
        }
    }
}
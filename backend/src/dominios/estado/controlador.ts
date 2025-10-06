/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';
import { EstadoServico } from './servico';
import { Estado } from './entidade/estado';
import { TratarErro } from '@/infraestrutura/erros/tratar-erro';

export class EstadoControlador {
    constructor(
        private readonly estadoServico = new EstadoServico
    ) { }

    /**
     * GET /estados
     * Busca todos os Estados com paginação, filtros e ordenação.
     */
    // EstadoControlador.ts
    async buscarTodosEstados(req: Request, res: Response) {
        try {
            console.log("Buscando todos os estados...");
            const RESULTADO = await this.estadoServico.buscarTodosEstados();
            return res.json(RESULTADO);
        } catch (error) {
            return TratarErro(res, error, 'Erro ao buscar estados.');
        }
    }


    /**
     * GET /estados/:id
     * Busca um Estado pelo seu ID.
     */
    async buscarEstadoPorId(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);
            const ESTADO = await this.estadoServico.buscarEstadoPorId(ID);
            if (!ESTADO) {
                return res.status(404).json({ erro: 'Estado não encontrado.' });
            }
            return res.json(ESTADO);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar estado.' });
        }
    }

    /**
     * POST /estados
     * Cria um novo Estado.
     */
    async criarEstado(req: Request, res: Response) {
        try {
            const ESTADO_DATA: Estado = req.body;
            const NOVO_ESTADO = await this.estadoServico.criarEstado(ESTADO_DATA);
            res.status(201).json(NOVO_ESTADO);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao criar estado.' });
        }
    }

    /**
     * PUT /estados/:id
     * Atualiza um Estado existente pelo ID.
     */
    async atualizarEstado(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);
            const ESTADO_DATA: Estado = req.body;
            const ESTADO_ATUALIZADO = await this.estadoServico.atualizarEstado(ID, ESTADO_DATA);
            if (!ESTADO_ATUALIZADO) {
                return res.status(404).json({ erro: 'Estado não encontrado.' });
            }
            return res.json(ESTADO_ATUALIZADO);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao atualizar estado.' });
        }
    }

    /**
     * DELETE /estados/:id
     * Remove um Estado pelo seu ID.
     */
    async deletarEstado(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);
            await this.estadoServico.deletarEstado(ID);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao deletar estado.' });
        }
    }
}
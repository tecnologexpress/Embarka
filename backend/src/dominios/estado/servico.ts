import { EstadoRepositorio } from './repositorio';
import { Estado } from './entidade/estado';
import { ResultadoPaginado } from '@/types/resultado-paginado';

/**
 * Serviço para operações de negócio relacionadas à entidade Estado.
 */
export class EstadoServico {
    constructor(
        private readonly estadoRepositorio = new EstadoRepositorio
    ) { }

    /**
     * Busca todos os Estados com paginação, filtros e ordenação.
     */
    async buscarTodosEstados(
        prm_paginacao: {
            pagina_atual: number;
            itens_por_pagina: number;
        },
        prm_ordenacao: {
            ordenar_coluna?: string;
            ordenar_direcao?: 'ASC' | 'DESC';
        }
    ): Promise<ResultadoPaginado<Estado>> {
        return this.estadoRepositorio.buscarTodosEstados(prm_paginacao, prm_ordenacao);
    }

    /**
     * Busca um Estado pelo seu ID.
     */
    async buscarEstadoPorId(prm_id: number): Promise<Estado | null> {
        return this.estadoRepositorio.buscarEstadoPorId(prm_id);
    }

    /**
     * Cria um novo Estado.
     */
    async criarEstado(prm_data: Estado): Promise<Estado> {
        return this.estadoRepositorio.criarEstado(prm_data);
    }

    /**
     * Atualiza um Estado existente pelo ID.
     */
    async atualizarEstado(prm_id: number, prm_data: Estado): Promise<Estado | null> {
        return this.estadoRepositorio.atualizarEstado(prm_id, prm_data);
    }

    /**
     * Remove um Estado pelo seu ID.
     */
    async deletarEstado(prm_id: number): Promise<void> {
        await this.estadoRepositorio.deletarEstado(prm_id);
    }
}
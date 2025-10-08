import { APP_DATA_SOURCE } from '@/infraestrutura/database';
import { Estado } from './entidade/estado';
import { HttpErro } from '@/infraestrutura/erros/http-error';
import { ResultadoPaginado } from '@/types/resultado-paginado';

/**
 * Repositório para gerenciar entidades Estado (Unidades Federativas) no banco de dados.
 */
export class EstadoRepositorio {
    constructor(
        private estadoRepositorio = APP_DATA_SOURCE.getRepository(Estado)
    ) { }

    /**
     * Busca todos os Estados cadastrados com paginação, filtros e ordenação.
     * @param prm_paginacao Objeto com página e limite.
     * @param prm_filtros Objeto com termo de busca opcional.
     * @param prm_ordenacao Objeto com coluna e direção de ordenação.
     * @returns Resultado paginado com entidades Estado.
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
        const { pagina_atual: PAGINA_ATUAL, itens_por_pagina: ITENS_POR_PAGINA } = prm_paginacao;
        const { ordenar_coluna: COLUNA, ordenar_direcao: DIRECAO } = prm_ordenacao;

        const SKIP = (PAGINA_ATUAL - 1) * ITENS_POR_PAGINA;
        const TAKE = ITENS_POR_PAGINA;

        // Define coluna de ordenação padrão
        const COLUNA_ORDENACAO = COLUNA ? `estado.${COLUNA}` : 'estado.ds_estado';
        const DIRECAO_ORDENACAO = DIRECAO || 'ASC';

        const QUERY = this.estadoRepositorio.createQueryBuilder('estado')
            .orderBy(COLUNA_ORDENACAO, DIRECAO_ORDENACAO)
            .skip(SKIP)
            .take(TAKE);

        const [UFS, TOTAL] = await QUERY.getManyAndCount();

        return {
            resultados: UFS,
            total_itens: TOTAL,
            pagina_atual: PAGINA_ATUAL,
            itens_por_pagina: TAKE
        };
    }

    /**
     * Busca um Estado pelo seu ID.
     * @param prm_id ID do Estado.
     * @returns Estado encontrado ou null.
     */
    async buscarEstadoPorId(prm_id: number): Promise<Estado | null> {
        const ESTADO = await this.estadoRepositorio.findOneBy({ id_estado: prm_id });
        return ESTADO;
    }

    /**
     * Cria um novo Estado no banco.
     * @param prm_data Dados do Estado a ser criado.
     * @returns Estado criado.
     */
    async criarEstado(prm_data: Estado): Promise<Estado> {
        const NOVO_ESTADO = this.estadoRepositorio.create(prm_data);
        const ESTADO_SALVO = await this.estadoRepositorio.save(NOVO_ESTADO);
        return ESTADO_SALVO;
    }

    /**
     * Atualiza um Estado existente pelo ID.
     * @param prm_id ID do Estado a ser atualizado.
     * @param prm_data Novos dados para atualização.
     * @returns Estado atualizado ou null se não encontrado.
     */
    async atualizarEstado(prm_id: number, prm_data: Estado): Promise<Estado | null> {
        const RESULTADO = await this.estadoRepositorio.update({ id_estado: prm_id }, prm_data);
        if (RESULTADO.affected === 0) {
            return null;
        }
        const ESTADO_ATUALIZADO = await this.estadoRepositorio.findOneBy({ id_estado: prm_id });
        return ESTADO_ATUALIZADO;
    }

    /**
     * Remove um Estado pelo seu ID.
     * @param prm_id ID do Estado a ser removido.
     * @throws HttpErro caso o Estado não seja encontrado.
     */
    async deletarEstado(prm_id: number): Promise<void> {
        const RESULTADO = await this.estadoRepositorio.delete({ id_estado: prm_id });

        if (RESULTADO.affected === 0) {
            throw new HttpErro(404, `Estado com id ${prm_id} não encontrado.`);
        }
    }
}

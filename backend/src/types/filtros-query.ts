import { ParsedQs } from 'qs';

/**
 * Função extrai os valores de parâmetros de consulta (query params) de uma requisição.
 * Facilitar a padronização do recebimento dos filtros utilizados nas consultas.
 * @param query 
 * @returns Retorna um objeto contendo as informações de filtros, de paginacao e
 * ordenacao extraídos da query.
 */
export function extrairFiltrosDaQuery(prm_query: ParsedQs): {
    paginacao: {
        pagina_atual: number;
        itens_por_pagina: number;
    };
    filtros: {
        termoDeBusca?: string;
        data?: Date;
        dataInicio?: Date;
        dataFim?: Date;
        estadoAbreviado?: string;
        municipio?: string;
        codigoIbge?: number;
        codigoIbgeOrigem?: number;
        codigoIbgeDestino?: number;
        estadoAbreviadoOrigem?: string;
        estadoAbreviadoDestino?: string;
    };
    ordenacao: {
        coluna?: string;
        direcao?: 'ASC' | 'DESC';
    }
} {
    // Paginacao
    const PAGINA_ATUAL = Number(prm_query.pagina_atual) || 1;
    const ITENS_POR_PAGINA = Number(prm_query.itens_por_pagina) || 10;

    // Ordenacao
    const COLUNA = typeof prm_query.ordenarColuna === "string" ? prm_query.ordenarColuna : undefined;
    const DIRECAO = prm_query.ordenarDirecao === "ASC" ? "ASC" : "DESC";

    // Filtros
    const TERMO_DE_BUSCA = typeof prm_query.termoDeBusca === "string" ? prm_query.termoDeBusca : undefined;
    
    const ESTADO_ABREVIADO = typeof prm_query.filtroEstadoAbreviado === "string" ? prm_query.filtroEstadoAbreviado : undefined;
    const ESTADO_ABREVIADO_ORIGEM = typeof prm_query.filtroEstadoAbreviadoOrigem === "string" ? prm_query.filtroEstadoAbreviadoOrigem : undefined;
    const ESTADO_ABREVIADO_DESTINO = typeof prm_query.filtroEstadoAbreviadoDestino === "string" ? prm_query.filtroEstadoAbreviadoDestino : undefined;
    
    const CODIGO_IBGE = typeof prm_query.codigoIbge === "string" ? Number(prm_query.codigoIbge) : undefined;
    const CODIGO_IBGE_ORIGEM = typeof prm_query.codigoIbgeOrigem === "string" ? Number(prm_query.codigoIbgeOrigem) : undefined;
    const CODIGO_IBGE_DESTINO = typeof prm_query.codigoIbgeDestino === "string" ? Number(prm_query.codigoIbgeDestino) : undefined;
    
    const DATA = typeof prm_query.data === "string" ? new Date(prm_query.data) : undefined;
    let data_inicio: Date | undefined;
    let data_fim: Date | undefined;

    if (typeof prm_query.dataInicio === "string") {
        const INICIO = new Date(prm_query.dataInicio);
        if (!isNaN(INICIO.getTime())) {
            data_inicio = INICIO;
        }
    }
    if (typeof prm_query.dataFim === "string") {
        const FIM = new Date(prm_query.dataFim);
        if (!isNaN(FIM.getTime())) {
            // Ajuste de data
            FIM.setDate(FIM.getDate() + 1);
            FIM.setHours(20, 59, 59, 999);
            data_fim = FIM;
        }
    }

    return {
        paginacao: {
            pagina_atual: PAGINA_ATUAL,
            itens_por_pagina: ITENS_POR_PAGINA
        },
        filtros: {
            ...(TERMO_DE_BUSCA !== undefined ? { termoDeBusca: TERMO_DE_BUSCA } : {}),
            ...(DATA !== undefined ? { data: DATA } : {}),
            ...(data_inicio !== undefined ? { dataInicio: data_inicio } : {}),
            ...(data_fim !== undefined ? { dataFim: data_fim } : {}),
            ...(ESTADO_ABREVIADO !== undefined ? { estadoAbreviado: ESTADO_ABREVIADO } : {}),
            ...(ESTADO_ABREVIADO_ORIGEM !== undefined ? { estadoAbreviadoOrigem: ESTADO_ABREVIADO_ORIGEM } : {}),
            ...(ESTADO_ABREVIADO_DESTINO !== undefined ? { estadoAbreviadoDestino: ESTADO_ABREVIADO_DESTINO } : {}),
            ...(CODIGO_IBGE !== undefined ? { codigoIbge: CODIGO_IBGE } : {}),
            ...(CODIGO_IBGE_ORIGEM !== undefined ? { codigoIbgeOrigem: CODIGO_IBGE_ORIGEM } : {}),
            ...(CODIGO_IBGE_DESTINO !== undefined ? { codigoIbgeDestino: CODIGO_IBGE_DESTINO } : {}),
        },
        ordenacao: {
            ...(COLUNA !== undefined ? { coluna: COLUNA } : {}),
            direcao: DIRECAO
        }
    };
}
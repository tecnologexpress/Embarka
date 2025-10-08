import { ParsedQs } from 'qs';

/**
 * Função extrai os valores de parâmetros de consulta (query params) de uma requisição.
 * Facilitar a padronização do recebimento dos filtros utilizados nas consultas.
 * @param prm_query 
 * @returns Retorna um objeto contendo as informações de filtros, de paginacao e
 * ordenacao extraídos da query.
 */
export function extrairFiltrosDaQuery(prm_query: ParsedQs): {
    paginacao: {
        pagina_atual: number;
        itens_por_pagina: number;
    };
    filtros: {
        termo_de_busca?: string;
        data?: Date;
        data_inicio?: Date;
        data_fim?: Date;
        estado_abreviado?: string;
        municipio?: string;
        codigo_ibge?: number;
        codigo_ibge_origem?: number;
        codigo_ibge_destino?: number;
        estado_abreviado_origem?: string;
        estado_abreviado_destino?: string;

        id_fornecedor?: number;
        dia_da_semana?: string;
    };
    ordenacao: {
        ordenar_coluna?: string;
        ordenar_direcao?: 'ASC' | 'DESC';
    }
} {
    // Paginacao
    const PAGINA_ATUAL = Number(prm_query.pagina_atual) || 1;
    const ITENS_POR_PAGINA = Number(prm_query.itens_por_pagina) || 10;

    // Ordenacao
    const COLUNA = typeof prm_query.ordenar_coluna === "string" ? prm_query.ordenar_coluna : undefined;
    const DIRECAO = prm_query.ordenar_direcao === "ASC" ? "ASC" : "DESC";

    // Filtros
    const TERMO_DE_BUSCA = typeof prm_query.termo_de_busca === "string" ? prm_query.termo_de_busca : undefined;

    const ESTADO_ABREVIADO = typeof prm_query.estado_abreviado === "string" ? prm_query.estado_abreviado : undefined;
    const ESTADO_ABREVIADO_ORIGEM = typeof prm_query.estado_abreviado_origem === "string" ? prm_query.estado_abreviado_origem : undefined;
    const ESTADO_ABREVIADO_DESTINO = typeof prm_query.estado_abreviado_destino === "string" ? prm_query.estado_abreviado_destino : undefined;

    const CODIGO_IBGE = typeof prm_query.codigo_ibge === "string" ? Number(prm_query.codigo_ibge) : undefined;
    const CODIGO_IBGE_ORIGEM = typeof prm_query.codigo_ibge_origem === "string" ? Number(prm_query.codigo_ibge_origem) : undefined;
    const CODIGO_IBGE_DESTINO = typeof prm_query.codigo_ibge_destino === "string" ? Number(prm_query.codigo_ibge_destino) : undefined;

    const ID_FORNECEDOR = typeof prm_query.id_fornecedor === "string" ? Number(prm_query.id_fornecedor) : undefined;

    const DATA = typeof prm_query.data === "string" ? new Date(prm_query.data) : undefined;
    let data_inicio: Date | undefined;
    let data_fim: Date | undefined;

    if (typeof prm_query.data_inicio === "string") {
        const INICIO = new Date(prm_query.data_inicio);
        if (!isNaN(INICIO.getTime())) {
            data_inicio = INICIO;
        }
    }
    if (typeof prm_query.data_fim === "string") {
        const FIM = new Date(prm_query.data_fim);
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
            ...(TERMO_DE_BUSCA !== undefined ? { termo_de_busca: TERMO_DE_BUSCA } : {}),
            ...(DATA !== undefined ? { data: DATA } : {}),
            ...(data_inicio !== undefined ? { data_inicio: data_inicio } : {}),
            ...(data_fim !== undefined ? { data_fim: data_fim } : {}),
            ...(ESTADO_ABREVIADO !== undefined ? { estado_abreviado: ESTADO_ABREVIADO } : {}),
            ...(ESTADO_ABREVIADO_ORIGEM !== undefined ? { estado_abreviado_origem: ESTADO_ABREVIADO_ORIGEM } : {}),
            ...(ESTADO_ABREVIADO_DESTINO !== undefined ? { estado_abreviado_destino: ESTADO_ABREVIADO_DESTINO } : {}),
            ...(CODIGO_IBGE !== undefined ? { codigo_ibge: CODIGO_IBGE } : {}),
            ...(CODIGO_IBGE_ORIGEM !== undefined ? { codigo_ibge_origem: CODIGO_IBGE_ORIGEM } : {}),
            ...(CODIGO_IBGE_DESTINO !== undefined ? { codigo_ibge_destino: CODIGO_IBGE_DESTINO } : {}),
            ...(ID_FORNECEDOR !== undefined ? { id_fornecedor: ID_FORNECEDOR } : {})
        },
        ordenacao: {
            ...(COLUNA !== undefined ? { ordenar_coluna: COLUNA } : {}),
            ...(DIRECAO !== undefined ? { ordenar_direcao: DIRECAO } : {}),
        }
    };
}
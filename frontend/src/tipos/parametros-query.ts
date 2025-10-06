interface OrdenacaoColunas {
    ordenarColuna?: string;
    ordenarDirecao?: 'ASC' | 'DESC';
}

export interface parametrosDeQuery extends OrdenacaoColunas {
    termoDeBusca?: string;
    pagina_atual?: number;
    itens_por_pagina?: number;
    
    codigoIbge?: number;
    codigoIbgeOrigem?: number;
    codigoIbgeDestino?: number;

    filtroEstadoAbreviado?: string;
    filtroEstadoAbreviadoOrigem?: string;
    filtroEstadoAbreviadoDestino?: string;
    
    data?: string;
    dataInicio?: string;
    dataFim?: string;
}
interface OrdenacaoColunas {
    ordenarColuna?: string;
    ordenarDirecao?: 'ASC' | 'DESC';
}

export interface parametrosDeQuery extends OrdenacaoColunas {
    termo_de_busca?: string;
    pagina_atual?: number;
    itens_por_pagina?: number;

    codigo_ibge?: number;
    codigo_ibge_origem?: number;
    codigo_ibge_destino?: number;

    estado_abreviado?: string;
    estado_abreviado_origem?: string;
    estado_abreviado_destino?: string;

    data?: string;
    data_inicio?: string;
    data_fim?: string;

    dia_da_semana?: string; // 'SEGUNDA'...'DOMINGO'

    id_fornecedor?: number;
    id_transportadora?: number;
    id_cliente?: number;
}
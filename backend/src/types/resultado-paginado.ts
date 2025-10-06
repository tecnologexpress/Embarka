/**
 * Interface representando um conjunto de resultados paginados.
 *
 * @template T - O tipo de itens contidos nos resultados paginados
 *
 * @interface ResultadoPaginado
 *
 * @property {T[]} resultados - Array contendo os itens da página atual
 * @property {number} total_itens - Número total de itens em todas as páginas
 * @property {number} pagina_atual - Número da página atual (normalmente baseado em 1)
 * @property {number} itens_por_pagina - Número máximo de itens por página
 */
export interface ResultadoPaginado<T> {
    resultados: T[];
    total_itens: number;
    pagina_atual: number;
    itens_por_pagina: number;
}
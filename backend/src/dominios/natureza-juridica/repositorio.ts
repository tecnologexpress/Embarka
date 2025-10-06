import { Pessoa } from '@/dominios/pessoa/entidade/entidade';
import { APP_DATA_SOURCE } from '../../infraestrutura/database';
import { PessoaNaturezaJuridica } from './entidade/pessoa-natureza-juridica';
import { ResultadoPaginado } from '@/types/resultado-paginado';

export class RepositorioNaturezaJuridica {
    constructor(
        private readonly repositorioPessoa = APP_DATA_SOURCE.getRepository(Pessoa)
    ) { }

    /**
     * Filtra e retorna uma lista de pessoas associadas a uma Natureza Jurídica específica,
     * baseada na descrição fornecida.
     *
     * @param prm_descricao - Descrição da Natureza Jurídica para filtro. Deve aceitar apenas 'fisica' ou 'juridica'.
     * @returns Uma Promise que resolve para um array de objetos Pessoa associados à Natureza Jurídica informada.
     */
    async buscarPessoasPorNatureza(prm_descricao: 'fisica' | 'juridica'): Promise<ResultadoPaginado<Pessoa>> {
        // QueryBuilder para buscar pessoas pela natureza jurídica
        const QUERY = this.repositorioPessoa.createQueryBuilder('pessoa')
            .innerJoin(PessoaNaturezaJuridica, 'pnj', 'pnj.pessoaId = pessoa.id')
            .where('pnj.descricao = :descricao', { descricao: prm_descricao });

        const [RESULTADOS, TOTAL_ITENS] = await QUERY.getManyAndCount();

        return {
            resultados: RESULTADOS,
            total_itens: TOTAL_ITENS,
            pagina_atual: 1,
            itens_por_pagina: RESULTADOS.length,
        };
    }
}
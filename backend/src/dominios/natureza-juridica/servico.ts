import { RepositorioNaturezaJuridica } from './repositorio';
import { Pessoa } from '@/dominios/pessoa/entidade/entidade';
import { HttpErro } from '@/infraestrutura/erros/http-error';
import { ResultadoPaginado } from '@/types/resultado-paginado';

export class ServicoNaturezaJuridica {
    constructor(
        private readonly repositorioNaturezaJuridica: RepositorioNaturezaJuridica
    ) { }

    /**
     * Busca pessoas por natureza jurídica ('fisica' ou 'juridica').
     * @param descricao - Natureza jurídica para filtro.
     * @returns Resultado paginado de pessoas.
     */
    async buscarPessoasPorNatureza(prm_descricao: 'fisica' | 'juridica'): Promise<ResultadoPaginado<Pessoa>> {
        if (prm_descricao !== 'fisica' && prm_descricao !== 'juridica') {
            throw new HttpErro(400, 'Descrição inválida. Use "fisica" ou "juridica".');
        }
        return await this.repositorioNaturezaJuridica.buscarPessoasPorNatureza(prm_descricao);
    }
}
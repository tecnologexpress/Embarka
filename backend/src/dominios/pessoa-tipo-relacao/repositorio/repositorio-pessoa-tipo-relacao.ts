import { Repository } from 'typeorm';
import { PessoaTipoRelacao } from '../entidade/pessoa-tipo-relacao';
import { APP_DATA_SOURCE } from '@/infraestrutura/database';

export class RepositorioPessoaTipoRelacao {
    private readonly REPOSITORIO: Repository<PessoaTipoRelacao>;

    constructor() {
        this.REPOSITORIO = APP_DATA_SOURCE.getRepository(PessoaTipoRelacao);
    }

    /**
     * Busca todas as relações
     */
    public async buscarTodas(): Promise<PessoaTipoRelacao[]> {
        return await this.REPOSITORIO.find({
            relations: ['pessoa', 'pessoa_tipo']
        });
    }

    /**
     * Busca relação por ID
     */
    public async buscarPorId(prm_id_relacao: number): Promise<PessoaTipoRelacao | null> {
        return await this.REPOSITORIO.findOne({
            where: { id_pessoa_tipo_relacao: prm_id_relacao },
            relations: ['pessoa', 'pessoa_tipo']
        });
    }

    /**
     * Busca tipos de uma pessoa
     */
    public async buscarTiposPorPessoa(prm_id_pessoa: number): Promise<PessoaTipoRelacao[]> {
        return await this.REPOSITORIO.find({
            where: { id_pessoa: prm_id_pessoa },
            relations: ['pessoa_tipo']
        });
    }

    /**
     * Busca pessoas por tipo
     */
    public async buscarPessoasPorTipo(prm_id_pessoa_tipo: number): Promise<PessoaTipoRelacao[]> {
        return await this.REPOSITORIO.find({
            where: { id_pessoa_tipo: prm_id_pessoa_tipo },
            relations: ['pessoa']
        });
    }

    /**
     * Verifica se pessoa já tem determinado tipo
     */
    public async pessoaTemTipo(prm_id_pessoa: number, prm_id_pessoa_tipo: number): Promise<boolean> {
        const RELACAO = await this.REPOSITORIO.findOne({
            where: {
                id_pessoa: prm_id_pessoa,
                id_pessoa_tipo: prm_id_pessoa_tipo
            }
        });
        return RELACAO !== null;
    }

    /**
     * Salva relação
     */
    public async salvar(prm_relacao: PessoaTipoRelacao): Promise<PessoaTipoRelacao> {
        return await this.REPOSITORIO.save(prm_relacao);
    }

    /**
     * Adiciona tipo à pessoa (se não existir)
     */
    public async adicionarTipoAPessoa(prm_id_pessoa: number, prm_id_pessoa_tipo: number): Promise<PessoaTipoRelacao | null> {
        const JA_EXISTE = await this.pessoaTemTipo(prm_id_pessoa, prm_id_pessoa_tipo);
        
        if (JA_EXISTE) {
            return null; // Já existe, não adiciona
        }

        const NOVA_RELACAO = new PessoaTipoRelacao();
        NOVA_RELACAO.id_pessoa_tipo = prm_id_pessoa_tipo;
        NOVA_RELACAO.id_pessoa = prm_id_pessoa;
        return await this.salvar(NOVA_RELACAO);
    }

    /**
     * Remove relação
     */
    public async remover(prm_id_relacao: number): Promise<boolean> {
        const RESULTADO = await this.REPOSITORIO.delete(prm_id_relacao);
        return RESULTADO.affected !== undefined && RESULTADO.affected !== null && RESULTADO.affected > 0;
    }

    /**
     * Remove tipo de uma pessoa
     */
    public async removerTipoDaPessoa(prm_id_pessoa: number, prm_id_pessoa_tipo: number): Promise<boolean> {
        const RESULTADO = await this.REPOSITORIO.delete({
            id_pessoa: prm_id_pessoa,
            id_pessoa_tipo: prm_id_pessoa_tipo
        });
        return RESULTADO.affected !== undefined && RESULTADO.affected !== null && RESULTADO.affected > 0;
    }

    /**
     * Remove todos os tipos de uma pessoa
     */
    public async removerTodosTiposDaPessoa(prm_id_pessoa: number): Promise<boolean> {
        const RESULTADO = await this.REPOSITORIO.delete({
            id_pessoa: prm_id_pessoa
        });
        return RESULTADO.affected !== undefined && RESULTADO.affected !== null && RESULTADO.affected > 0;
    }

    /**
     * Atualiza os tipos de uma pessoa (remove todos e adiciona os novos)
     */
    public async atualizarTiposDaPessoa(prm_id_pessoa: number, prm_ids_tipos: number[]): Promise<PessoaTipoRelacao[]> {
        // Remove todos os tipos atuais
        await this.removerTodosTiposDaPessoa(prm_id_pessoa);

        // Adiciona os novos tipos
        const NOVAS_RELACOES: PessoaTipoRelacao[] = [];
        for (const ID_TIPO of prm_ids_tipos) {
            const NOVA_RELACAO = new PessoaTipoRelacao();
            NOVA_RELACAO.id_pessoa_tipo = ID_TIPO;
            NOVA_RELACAO.id_pessoa = prm_id_pessoa;
            const RELACAO_SALVA = await this.salvar(NOVA_RELACAO);
            NOVAS_RELACOES.push(RELACAO_SALVA);
        }

        return NOVAS_RELACOES;
    }
}
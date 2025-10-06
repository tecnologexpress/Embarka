import { Repository } from 'typeorm';
import { APP_DATA_SOURCE } from '../../../infraestrutura/database';
import { PessoaTipo, TipoPessoa } from '../entidade/pessoa-tipo';

export class RepositorioPessoaTipo {
    private readonly REPOSITORIO: Repository<PessoaTipo>;

    constructor() {
        this.REPOSITORIO = APP_DATA_SOURCE.getRepository(PessoaTipo);
    }

    /**
     * Busca todos os tipos de pessoa
     */
    public async buscarTodos(): Promise<PessoaTipo[]> {
        return await this.REPOSITORIO.find({
            order: {
                ds_descricao: 'ASC'
            }
        });
    }

    /**
     * Busca tipo de pessoa por ID
     */
    public async buscarPorId(prm_id_pessoa_tipo: number): Promise<PessoaTipo | null> {
        return await this.REPOSITORIO.findOne({
            where: { id_pessoa_tipo: prm_id_pessoa_tipo }
        });
    }

    /**
     * Busca tipo de pessoa por descrição
     */
    public async buscarPorDescricao(prm_descricao: string): Promise<PessoaTipo | null> {
        return await this.REPOSITORIO.findOne({
            where: { ds_descricao: prm_descricao }
        });
    }

    /**
     * Busca tipo fornecedor
     */
    public async buscarFornecedor(): Promise<PessoaTipo | null> {
        return await this.buscarPorDescricao(TipoPessoa.FORNECEDOR);
    }

    /**
     * Busca tipo cliente
     */
    public async buscarCliente(): Promise<PessoaTipo | null> {
        return await this.buscarPorDescricao(TipoPessoa.CLIENTE);
    }

    /**
     * Busca tipo embarcador
     */
    public async buscarEmbarcador(): Promise<PessoaTipo | null> {
        return await this.buscarPorDescricao(TipoPessoa.EMBARCADOR);
    }

    /**
     * Busca tipo transportadora
     */
    public async buscarTransportadora(): Promise<PessoaTipo | null> {
        return await this.buscarPorDescricao(TipoPessoa.TRANSPORTADORA);
    }

    /**
     * Salva tipo de pessoa
     */
    public async salvar(prm_pessoa_tipo: PessoaTipo): Promise<PessoaTipo> {
        return await this.REPOSITORIO.save(prm_pessoa_tipo);
    }

    /**
     * Remove tipo de pessoa
     */
    public async remover(prm_id_pessoa_tipo: number): Promise<boolean> {
        const RESULTADO = await this.REPOSITORIO.delete(prm_id_pessoa_tipo);
        return RESULTADO.affected !== undefined && RESULTADO.affected !== null && RESULTADO.affected > 0;
    }

    /**
     * Cria os tipos de pessoa padrão se não existirem
     */
    public async criarPadroes(): Promise<void> {
        const TIPOS_PADRAO = [
            TipoPessoa.FORNECEDOR,
            TipoPessoa.CLIENTE,
            TipoPessoa.EMBARCADOR,
            TipoPessoa.TRANSPORTADORA
        ];

        for (const TIPO of TIPOS_PADRAO) {
            const EXISTENTE = await this.buscarPorDescricao(TIPO);
            if (!EXISTENTE) {
                const NOVO_TIPO = new PessoaTipo(TIPO);
                await this.salvar(NOVO_TIPO);
            }
        }
    }

    /**
     * Busca tipos com relações de pessoas
     */
    public async buscarComRelacoes(): Promise<PessoaTipo[]> {
        return await this.REPOSITORIO.find({
            relations: ['pessoa_tipo_relacoes', 'pessoa_tipo_relacoes.pessoa'],
            order: {
                ds_descricao: 'ASC'
            }
        });
    }
}
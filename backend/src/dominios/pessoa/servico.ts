import { Pessoa } from './entidade/entidade';
import { RepositorioPessoa } from './repositorio';

export class ServicoPessoa {
    constructor(
        private repositorioPessoa: RepositorioPessoa
    ) { }

    async criarPessoa(prm_data: any,
        //  prm_username: string, prm_usuario_ip: string

    ) {
        const NOVA_PESSOA = new Pessoa();
        Object.assign(NOVA_PESSOA, prm_data);

        // Lógica para criar uma nova pessoa
        const PESSOA_CRIADA = await this.repositorioPessoa.salvarPessoa(NOVA_PESSOA);

        // Criar LOG de criação de pessoa aqui

        return PESSOA_CRIADA;
    }
}
import { HttpErro } from '@/infraestrutura/erros/http-error';
import { Pessoa } from './entidade/pessoa.entidade';
import { PessoaRepositorio } from './repositorio';
import { criarSenhaHash } from '@/utils/senha-hash';
import { PessoaAcesso } from './entidade/pessoa-acesso.entidade';

export class PessoaServico {
    constructor(
        private readonly pessoaRepositorio: PessoaRepositorio
    ) { }

    async criarPessoa(
        prm_data: any,
        prm_senha: string,
        // prm_username: string, prm_usuario_ip: string // Parâmetros comentados
    ) {
        // 1. Validação de Duplicidade
        const EMAIL_JA_CADASTRADO = await this.pessoaRepositorio.emailJaCadastrado(prm_data.ds_email);
        if (EMAIL_JA_CADASTRADO) {
            throw new HttpErro(409, 'Email já cadastrado');
        }

        const CNPJ_JA_CADASTRADO = await this.pessoaRepositorio.cnpjJaCadastrado(prm_data.ds_documento);
        if (CNPJ_JA_CADASTRADO) {
            throw new HttpErro(409, 'CNPJ já cadastrado');
        }

        // 2. Preparação da Senha
        const SENHA_HASH = await criarSenhaHash(prm_senha);

        // monta entidade pessoa
        const NOVA_PESSOA = new Pessoa();
        Object.assign(NOVA_PESSOA, prm_data);

        // salva pessoa
        const PESSOA_CRIADA = await this.pessoaRepositorio.salvarPessoa(NOVA_PESSOA);

        // cria acesso usando o id_pessoa gerado
        const NOVO_ACESSO = new PessoaAcesso();
        NOVO_ACESSO.id_pessoa = PESSOA_CRIADA.id_pessoa; // FK obrigatória
        NOVO_ACESSO.ds_email = PESSOA_CRIADA.ds_email;
        NOVO_ACESSO.ds_senha_hash = SENHA_HASH;

        await this.pessoaRepositorio.salvarPessoaAcesso(NOVO_ACESSO);

        // opcional: anexar ao retorno
        PESSOA_CRIADA.pessoaAcesso = NOVO_ACESSO;

        return PESSOA_CRIADA;
    }
}

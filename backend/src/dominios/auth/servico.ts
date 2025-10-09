import { PessoaRepositorio } from "../pessoa/repositorio";
import { HttpErro } from "@/infraestrutura/erros/http-error";
import { validarSenhaHash } from "@/utils/senha-hash";

export class AuthServico {
    constructor(
        private readonly pessoaRepositorio: PessoaRepositorio
    ) { }

    /**
     * Valida credenciais (email/senha) e retorna dados mínimos do usuário
     * para iniciar o fluxo 2FA (gera temp2fa + envia OTP no controlador).
     */
    async autenticarUsuario(prm_email: string, prm_senha: string) {
        const PESSOA = await this.pessoaRepositorio.obterPessoaPorEmail(prm_email);
        if (!PESSOA || !PESSOA.pessoaAcesso) {
            throw new HttpErro(404, 'Empresa não encontrada nos registros. Verifique o email e tente novamente.');
        }

        const PESSOA_SENHA_HASH = await this.pessoaRepositorio.obterSenhaHashPorEmail(prm_email);
        if (!PESSOA_SENHA_HASH) {
            throw new HttpErro(404, 'Ocorreu um erro ao buscar a senha. Tente novamente mais tarde.');
        }

        const SENHA_VALIDA = await validarSenhaHash(prm_senha, PESSOA_SENHA_HASH);
        if (!SENHA_VALIDA) {
            throw new HttpErro(401, 'Credenciais inválidas. Verifique os campos e tente novamente.');
        }

        const ROLE_PESSOA = await this.pessoaRepositorio.verificarRolePessoa(PESSOA.ds_email);

        return {
            id_pessoa: PESSOA.id_pessoa,
            id_pessoa_acesso: PESSOA.pessoaAcesso.id_pessoa_acesso,
            email: PESSOA.ds_email,
            role: ROLE_PESSOA,
        };
    }
}

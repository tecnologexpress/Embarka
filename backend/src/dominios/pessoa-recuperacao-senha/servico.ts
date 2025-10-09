import { HttpErro } from "@/infraestrutura/erros/http-error";
import { PessoaRepositorio } from "@/dominios/pessoa/repositorio";
import { enviarEmail } from "@/infraestrutura/email";
import { criarSenhaHash } from "@/utils/senha-hash";
import { RecuperacaoDeSenhaRepositorio } from "./repositorio";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export class RecuperacaoDeSenhaServico {
    constructor(
        private readonly repositorioPessoa: PessoaRepositorio,
        private readonly repositorioPessoaRecuperacaoDeSenha: RecuperacaoDeSenhaRepositorio
    ) { }

    /** Passo 1: solicitar link (resposta sempre 204 para não vazar existência do email) */
    async solicitar(prm_email: string, prm_ip_solicitante: string) {
        const PESSOA = await this.repositorioPessoa.obterPessoaPorEmail(prm_email);
        if (!PESSOA || !PESSOA.pessoaAcesso) {
            // Resposta “cega”: não revela se existe ou não
            return;
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { token, expira_em } = await this.repositorioPessoaRecuperacaoDeSenha.criarTokenReset(
            PESSOA.id_pessoa,
            prm_ip_solicitante
        );

        const LINK = `${FRONTEND_URL}/resetar-senha?token=${encodeURIComponent(token)}`;
        await enviarEmail({
            prm_para: PESSOA.ds_email,
            prm_assunto: "Recuperação de senha",
            prm_texto:
                `Você solicitou a recuperação de senha.\n` +
                `Use este link dentro de ${Math.round((+expira_em - Date.now()) / 60000)} minutos:\n${LINK}\n\n` +
                `Se você não solicitou, ignore este e-mail.`,
            prm_html: `
        <p>Você solicitou a recuperação de senha.</p>
        <p><a href="${LINK}">Clique aqui para definir uma nova senha</a></p>
        <p>O link expira em ${Math.round((+expira_em - Date.now()) / 60000)} minutos.</p>
        <p>Se você não solicitou, ignore este e-mail.</p>
      `,
        });
    }

    /** Passo 2: confirmar reset (token + nova senha) */
    async confirmar(prm_token: string, prm_nova_senha: string) {
        if (!prm_nova_senha || prm_nova_senha.length < 8) {
            throw new HttpErro(400, "A nova senha deve ter ao menos 8 caracteres.");
        }

        const TOKEN_VALIDO = await this.repositorioPessoaRecuperacaoDeSenha.validarToken(prm_token);
        if (!TOKEN_VALIDO.ok) {
            const MAP: Record<string, string> = {
                NOT_FOUND: "Token inválido.",
                EXPIRED: "Token expirado. Solicite um novo link.",
                ALREADY_USED: "Token já utilizado. Solicite um novo link.",
            };
            throw new HttpErro(400, MAP[TOKEN_VALIDO.reason] || "Token inválido.");
        }

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { registro } = TOKEN_VALIDO;
        const NOVA_SENHA_HASH = await criarSenhaHash(prm_nova_senha);

        // troca senha
        await this.repositorioPessoa.atualizarSenhaHashPorPessoaId(registro.id_pessoa, NOVA_SENHA_HASH);

        // invalida token (single-use)
        await this.repositorioPessoaRecuperacaoDeSenha.consumirToken(prm_token);

        // opcional: invalidar sessões ativas (depende de como você guarda tokens)
        // Dica: incremente um "tokenVersion" do usuário e verifique no JWT.
    }
}

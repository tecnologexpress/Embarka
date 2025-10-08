import { HttpErro } from "@/infraestrutura/erros/http-error";
import { tratarErro } from "@/infraestrutura/erros/tratar-erro";
import { obterClienteIP } from "@/utils/obter-ip";
import { Request, Response } from "express";
import { AuthServico } from "./servico";
import { RequestAutenticado } from "@/middleware/autenticar-token";
import { gerarToken } from "@/utils/token-jwt";
import { gerarTokenTemp, verificarTokenTemp } from "@/utils/token-temp";
import { criarEnviarOtp, verificarOtp } from "@/dominios/pessoa-otp/otp-servico";
import { PessoaRepositorio } from "@/dominios/pessoa/repositorio";

export class AuthControlador {
    constructor(
        private readonly AuthServico: AuthServico,
        private readonly PessoaRepo: PessoaRepositorio
    ) { }

    /**
     * Etapa 1 do login:
     * - valida email/senha
     * - cria token temporário (temp2fa) no cookie
     * - envia OTP por e-mail
     */
    async autenticarUsuario(req: Request, res: Response): Promise<void> {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { email, senha } = req.body;
            if (!email || !senha) {
                throw new HttpErro(400, 'Email e senha são obrigatórios para autenticação');
            }

            const USUARIO_IP = obterClienteIP(req);
            if (!USUARIO_IP) {
                throw new HttpErro(401, 'Não foi possível coletar informações do usuário. Aguarde um momento e tente novamente.');
            }

            // valida credenciais e obtém dados mínimos
            const DADOS = await this.AuthServico.autenticarUsuario(email, senha);

            // gera token temporário de 2FA
            const TEMP_TOKEN = gerarTokenTemp({ id_pessoa: DADOS.id_pessoa });

            // seta cookie temporário (sem privilégios)
            res.cookie('temp2fa', TEMP_TOKEN, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 10 * 60 * 1000, // 10 minutos
                path: '/',
            });

            // dispara OTP por e-mail
            await criarEnviarOtp(DADOS.id_pessoa, email);

            res.status(200).json({ twoFactorRequired: true });
        } catch (err: any) {
            tratarErro(res, err, "Erro ao autenticar usuário (etapa 1)");
        }
    }

    /**
     * Etapa 2 do login:
     * - recebe código OTP
     * - valida temp2fa -> id_pessoa
     * - verifica OTP
     * - gera token final (cookie 'token') e remove temp2fa
     */
    async verificar2FA(req: Request, res: Response): Promise<void> {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { codigo } = req.body;
            const TEMP = req.cookies?.temp2fa as string | undefined;
            if (!TEMP) {
                throw new HttpErro(401, "Sessão 2FA não iniciada");
            }

            if (!codigo) {
                throw new HttpErro(400, "Informe o código de verificação");
            }

            const PAYLOAD = verificarTokenTemp(TEMP); // { id_pessoa }
            const VERIFICA = await verificarOtp(PAYLOAD.id_pessoa, String(codigo));

            if (!VERIFICA.ok) {
                const MAP: Record<string, string> = {
                    "NAO_ENCONTRADO": "Código não encontrado. Solicite um novo.",
                    "EXPIRADO": "Código expirado. Solicite um novo.",
                    "MUITAS_TENTATIVAS": "Muitas tentativas. Solicite um novo código.",
                    "CODIGO_INVALIDO": "Código inválido.",
                };
                const MENSAGEM = MAP[VERIFICA.reason || ""] || "Não foi possível validar o código";
                throw new HttpErro(400, MENSAGEM);
            }

            // carrega dados do usuário para montar o token final
            const PESSOA = await this.PessoaRepo.obterPessoaPorId(PAYLOAD.id_pessoa);
            if (!PESSOA || !PESSOA.pessoaAcesso) {
                throw new HttpErro(404, "Usuário não encontrado para finalizar a autenticação");
            }

            const ROLE = await this.PessoaRepo.verificarRolePessoa(PESSOA.ds_email);

            const TOKEN_FINAL = gerarToken({
                id_pessoa: PESSOA.id_pessoa,
                id_pessoa_acesso: PESSOA.pessoaAcesso.id_pessoa_acesso,
                email: PESSOA.ds_email,
                usuario_ip: obterClienteIP(req),
                role: ROLE,
            });

            // limpa temp2fa e seta token final
            res.clearCookie("temp2fa", { path: "/" });
            res.cookie("token", TOKEN_FINAL, {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 9 * 60 * 60 * 1000,
                path: '/',
            });

            res.status(200).json({ success: true });
        } catch (err: any) {
            tratarErro(res, err, "Erro ao verificar 2FA (etapa 2)");
        }
    }

    /**
     * Reenvia o OTP (precisa do temp2fa ativo)
     */
    async reenviar2FA(req: Request, res: Response): Promise<void> {
        try {
            const TEMP = req.cookies?.temp2fa as string | undefined;
            if (!TEMP) {
                throw new HttpErro(401, "Sessão 2FA não iniciada");
            }
            const PAYLOAD = verificarTokenTemp(TEMP);
            const PESSOA = await this.PessoaRepo.obterPessoaPorId(PAYLOAD.id_pessoa);
            if (!PESSOA) {
                throw new HttpErro(404, "Usuário não encontrado para reenvio de código");
            }

            await criarEnviarOtp(PESSOA.id_pessoa, PESSOA.ds_email);
            res.status(204).send();
        } catch (err: any) {
            tratarErro(res, err, "Erro ao reenviar 2FA");
        }
    }

    /**
 * Faz logout do usuário
 */
    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie("token", { path: "/" });
            res.status(204).send();
        } catch (err: any) {
            tratarErro(res, err, "Erro ao fazer logout");
        }
    }

    /**
     * Retorna dados do usuário autenticado pelo token final
     */
    me(req: RequestAutenticado, res: Response): void {
        try {
            if (!req.token) {
                throw new HttpErro(401, 'Usuário não autenticado.');
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id_pessoa, id_pessoa_acesso, email, usuario_ip, role } = req.token;
            res.status(200).json({ id_pessoa, id_pessoa_acesso, email, usuario_ip, role });
        } catch (err) {
            tratarErro(res, err, "Erro ao autenticar usuário");
        }
    }
}

import { Request, Response } from "express";
import { tratarErro } from "@/infraestrutura/erros/tratar-erro";
import { HttpErro } from "@/infraestrutura/erros/http-error";
import { obterClienteIP } from "@/utils/obter-ip";
import { RecuperacaoDeSenhaServico } from "./servico";

export class RecuperacaoDeSenhaControlador {
    constructor(
        private readonly recuperacaoDeSenhaServico: RecuperacaoDeSenhaServico
    ) { }

    /** POST /auth/recuperar/solicitar { email } */
    async solicitar(req: Request, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { email } = req.body;
            if (!email) throw new HttpErro(400, "Informe o e-mail.");

            const IP_USUARIO = obterClienteIP(req);
            await this.recuperacaoDeSenhaServico.solicitar(email, IP_USUARIO);
            // sempre 204: não revela se o email existe
            res.status(204).send();
        } catch (err) {
            tratarErro(res, err, "Erro ao solicitar recuperação de senha");
        }
    }

    /** POST /auth/recuperar/confirmar { token, nova_senha } */
    async confirmar(req: Request, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { token, nova_senha } = req.body;
            if (!token || !nova_senha) {
                throw new HttpErro(400, "Token e nova senha são obrigatórios.");
            }

            await this.recuperacaoDeSenhaServico.confirmar(token, String(nova_senha));
            res.status(204).send();
        } catch (err) {
            tratarErro(res, err, "Erro ao confirmar recuperação de senha");
        }
    }
}

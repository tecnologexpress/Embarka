import { RequestAutenticado } from "@/middleware/autenticar-token";
import { PessoaServico } from "./servico";
import { Response } from "express";
import { tratarErro } from "@/infraestrutura/erros/tratar-erro";

export class PessoaControlador {
    constructor(
        private pessoaServico: PessoaServico
    ) { }

    async criarPessoa(req: RequestAutenticado, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { senha, role, ...data } = req.body;

            const NOVA_PESSOA = await this.pessoaServico.criarPessoa(data, senha, role);

            res.status(201).json({ successo: true, data: NOVA_PESSOA });
        } catch (error: any) {
            tratarErro(res, error, "Erro ao criar pessoa.");
        }
    }
}

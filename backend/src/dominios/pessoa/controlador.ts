/* eslint-disable @typescript-eslint/naming-convention */
import { RequestAutenticado } from "@/middleware/autenticar-token";
import { PessoaServico } from "./servico";
import { Response } from "express";
import { tratarErro } from "@/infraestrutura/erros/tratar-erro";
// import { HttpErro } from "@/infraestrutura/erros/http-error";

export class PessoaControlador {
    constructor(
        private pessoaServico: PessoaServico
    ) { }

    async criarPessoa(req: RequestAutenticado, res: Response) {
        try {
            // TO-DO: Adicionar validação de dados com zod?
            const { data, senha } = req.body;

            // const { username, usuario_ip } = req.token || {};
            // if (!username || !usuario_ip) {
            //     throw new HttpErro(401, "Token inválido ou expirado");
            // }

            const novaPessoa = await this.pessoaServico.criarPessoa(data, senha
                //  username, usuario_ip
            );
            res.status(201).json({ success: true, data: novaPessoa });
        } catch (error: any) {
            tratarErro(res, error, "Erro ao criar pessoa.");
        }
    }
}
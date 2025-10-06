/* eslint-disable @typescript-eslint/naming-convention */
import { RequestAutenticado } from "@/middleware/autenticar-token";
import { ServicoPessoa } from "./servico";
import { TratarErro } from "@/infraestrutura/erros/tratar-erro";
import { Response } from "express";
import { HttpErro } from "@/infraestrutura/erros/http-error";

export class ControladorPessoa {
    constructor(
        private servicoPessoa: ServicoPessoa
    ) { }

    async criarPessoa(req: RequestAutenticado, res: Response) {

        try {
            const data = req.body;

            const { username, usuario_ip } = req.token || {};
            if (!username || !usuario_ip) {
                throw new HttpErro(401, "Token inválido ou expirado");
            }

            const novaPessoa = await this.servicoPessoa.criarPessoa(data,
                //  username, usuario_ip
                );
            res.status(201).json({ success: true, data: novaPessoa });
        } catch (error: any) {
            TratarErro(res, error, "ControladorPessoa.criarPessoa");
        }
    }
}
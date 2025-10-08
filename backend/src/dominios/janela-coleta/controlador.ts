import { Request, Response } from "express";
import { JanelaColetaServico } from "./servico";
import { extrairFiltrosDaQuery } from "@/types/filtros-query";
import { tratarErro } from "@/infraestrutura/erros/tratar-erro";
import { RequestAutenticado } from "@/middleware/autenticar-token";
import { HttpErro } from "@/infraestrutura/erros/http-error";
import { ICriarJanelaDeColeta } from "./dtos";

export class JanelaColetaControlador {
    constructor(
        private readonly janelaColetaServico = new JanelaColetaServico()
    ) { }

    async criarJanelaDeColeta(req: RequestAutenticado, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id_pessoa } = req.token || {};
            if (!id_pessoa) {
                throw new HttpErro(401, "Token inválido ou não fornecido.");
            }

            const DADOS: ICriarJanelaDeColeta = req.body;
            const RESULTADO = await this.janelaColetaServico.criarJanelaDeColeta(id_pessoa, DADOS);
            res.status(201).json(RESULTADO);
        } catch (erro) {
            tratarErro(res, erro, "Erro ao criar janela de coletas de fornecedor");
        }
    }

    async atualizarJanelaDeColeta(req: Request, res: Response) {
        try {
            const RESULTADO = await this.janelaColetaServico.atualizarJanelaDeColeta(req.body);
            res.json(RESULTADO);
        } catch (erro) {
            tratarErro(res, erro, "Erro ao atualizar janela de coletas de fornecedor");
        }
    }

    async removerJanelaDeColeta(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);

            await this.janelaColetaServico.removerJanelaDeColeta(ID);
            res.status(204).send();
        } catch (erro) {
            tratarErro(res, erro, "Erro ao remover janela de coletas de fornecedor.");
        }
    }

    async listarJanelas(req: Request, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { filtros } = extrairFiltrosDaQuery(req.query);

            const RESULTADO = await this.janelaColetaServico.listarJanelas(filtros);
            res.json(RESULTADO);
        } catch (erro) {
            tratarErro(res, erro, "Erro ao listar janela de coleta de fornecedor.");
        }
    }
}

import { Request, Response } from "express";
import { JanelaColetaServico } from "./servico";
import { extrairFiltrosDaQuery } from "@/types/filtros-query";
import { tratarErro } from "@/infraestrutura/erros/tratar-erro";
import { RequestAutenticado } from "@/middleware/autenticar-token";
import { HttpErro } from "@/infraestrutura/erros/http-error";
import { IAtualizarJanelaDeColetaDto, ICriarJanelaDeColeta } from "./dtos";

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
            const DADOS: IAtualizarJanelaDeColetaDto = req.body;

            const RESULTADO = await this.janelaColetaServico.atualizarJanelaDeColeta(DADOS);
            res.json(RESULTADO);
        } catch (erro) {
            tratarErro(res, erro, "Erro ao atualizar janela de coletas de fornecedor");
        }
    }

    async removerJanelaDeColeta(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);
            if (isNaN(ID) || ID <= 0) {
                throw new HttpErro(400, "ID inválido.");
            }

            await this.janelaColetaServico.removerJanelaDeColeta(ID);
            res.status(204).send();
        } catch (erro) {
            tratarErro(res, erro, "Erro ao remover janela de coletas de fornecedor.");
        }
    }

    async listarJanelas(req: RequestAutenticado, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { filtros } = extrairFiltrosDaQuery(req.query);

            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { id_pessoa } = req.token || {};
            if (!id_pessoa) {
                throw new HttpErro(401, "Token inválido ou não fornecido.");
            }

            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { resultados } = await this.janelaColetaServico.listarJanelas(id_pessoa, filtros);
            res.json(resultados);
        } catch (erro) {
            tratarErro(res, erro, "Erro ao listar janela de coleta de fornecedor.");
        }
    }
}

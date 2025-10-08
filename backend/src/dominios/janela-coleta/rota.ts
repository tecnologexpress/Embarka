import { Router } from "express";
import { Request, Response } from "express";
import { JanelaColetaControlador } from "./controlador";
import { autenticarToken } from "@/middleware/autenticar-token";
import {
    VALIDAR_CRIAR_GRADE,
    VALIDAR_ATUALIZAR_GRADE,
    coletarErros,
    // VALIDAR_PARAM_FORNECEDOR, // caso use em rotas futuras
} from "./validacao";

const JANELA_COLETA_FORNECEDOR_ROTA = Router();
const JANELA_COLETA_FORNECEDOR_CONTROLADOR = new JanelaColetaControlador();

JANELA_COLETA_FORNECEDOR_ROTA.post("/",
    autenticarToken,
    VALIDAR_CRIAR_GRADE,
    coletarErros,
    (req: Request, res: Response) => JANELA_COLETA_FORNECEDOR_CONTROLADOR.criarJanelaDeColeta(req as any, res)
);

JANELA_COLETA_FORNECEDOR_ROTA.put("/",
    autenticarToken,
    VALIDAR_ATUALIZAR_GRADE,
    coletarErros,
    (req: Request, res: Response) => JANELA_COLETA_FORNECEDOR_CONTROLADOR.atualizarJanelaDeColeta(req, res)
);

JANELA_COLETA_FORNECEDOR_ROTA.delete("/:id",
    autenticarToken,
    // se quiser validar só o param:
    // [param("id").isInt({gt:0}).withMessage("ID inválido")],
    // coletarErros,
    (req, res) => JANELA_COLETA_FORNECEDOR_CONTROLADOR.removerJanelaDeColeta(req, res)
);

JANELA_COLETA_FORNECEDOR_ROTA.get("/",
    autenticarToken,
    (req, res) => JANELA_COLETA_FORNECEDOR_CONTROLADOR.listarJanelas(req, res)
);

export default JANELA_COLETA_FORNECEDOR_ROTA;

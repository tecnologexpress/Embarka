import { Router } from 'express';
import { Request, Response } from 'express';
import { PessoaRepositorio } from './repositorio';
import { PessoaServico } from './servico';
import { PessoaControlador } from './controlador';
import { validarCriarPessoa } from './validacao/validar-criar-pessoa';

const PESSOA_ROTA = Router();

const PESSOA_REPOSITORIO = new PessoaRepositorio();
const PESSOA_SERVICO = new PessoaServico(PESSOA_REPOSITORIO);
const PESSOA_CONTROLADOR = new PessoaControlador(PESSOA_SERVICO);

PESSOA_ROTA.post('/criar', validarCriarPessoa, (req: Request, res: Response) =>
    PESSOA_CONTROLADOR.criarPessoa(req, res)
);

export default PESSOA_ROTA;
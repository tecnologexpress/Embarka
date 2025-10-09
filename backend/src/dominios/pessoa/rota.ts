import { Router } from 'express';
import { Request, Response } from 'express';
import { PessoaRepositorio } from './repositorio';
import { PessoaServico } from './servico';
import { PessoaControlador } from './controlador';
import { validarCriarPessoa } from './validacao/validar-criar-pessoa';
import { FornecedorRepositorio } from '../fornecedor/repositorio';
import { ClienteRepositorio } from '../cliente/repositorio';
import { EmbarcadorRepositorio } from '../embarcador/repositorio';
import { TransportadoraRepositorio } from '../transportadora/repositorio';

const PESSOA_ROTA = Router();

const FORNECEDOR_REPOSITORIO = new FornecedorRepositorio();
const CLIENTE_REPOSITORIO = new ClienteRepositorio();
const EMBARCADOR_REPOSITORIO = new EmbarcadorRepositorio();
const TRANSPORTADORA_REPOSITORIO = new TransportadoraRepositorio();

const PESSOA_REPOSITORIO = new PessoaRepositorio();
const PESSOA_SERVICO = new PessoaServico(PESSOA_REPOSITORIO, FORNECEDOR_REPOSITORIO, CLIENTE_REPOSITORIO, EMBARCADOR_REPOSITORIO, TRANSPORTADORA_REPOSITORIO);
const PESSOA_CONTROLADOR = new PessoaControlador(PESSOA_SERVICO);

PESSOA_ROTA.post('/criar', validarCriarPessoa, (req: Request, res: Response) =>
    PESSOA_CONTROLADOR.criarPessoa(req, res)
);

export default PESSOA_ROTA;
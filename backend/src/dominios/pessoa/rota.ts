import { Router } from 'express';
import { autenticarToken } from '@/middleware/autenticar-token';
import { ControladorPessoa } from './controlador';
import { RepositorioPessoa } from './repositorio';
import { ServicoPessoa } from './servico';

const PESSOA_ROTA = Router();

const PESSOA_REPOSITORIO = new RepositorioPessoa();
const PESSOA_SERVICO = new ServicoPessoa(PESSOA_REPOSITORIO);
const PESSOA_CONTROLADOR = new ControladorPessoa(PESSOA_SERVICO);

PESSOA_ROTA.post('/criar', autenticarToken, (req, res) =>
    PESSOA_CONTROLADOR.criarPessoa(req, res)
);

export default PESSOA_ROTA;
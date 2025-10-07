import { Router } from 'express';
import { FornecedorServico } from './servico';
import { FornecedorControlador } from './controlador';
import { FornecedorRepositorio } from './repositorio';

const FORNECEDOR_ROTA = Router();
const FORNECEDOR_REPOSITORIO = new FornecedorRepositorio();
const FORNECEDOR_SERVICO = new FornecedorServico(FORNECEDOR_REPOSITORIO);
const FORNECEDOR_CONTROLADOR = new FornecedorControlador(FORNECEDOR_SERVICO);

FORNECEDOR_ROTA.get('/', (req, res) => FORNECEDOR_CONTROLADOR.listarFornecedores(req, res));
FORNECEDOR_ROTA.get('/:id', (req, res) => FORNECEDOR_CONTROLADOR.buscarFornecedorPorId(req, res));

export default FORNECEDOR_ROTA;
import { Router } from 'express';
import { EstadoControlador } from './controlador';

const ESTADO_CONTROLADOR = new EstadoControlador();
const ESTADO_ROTA = Router();

// Rota para testes
ESTADO_ROTA.get('/', (req, res) => {
    res.send('API de Estados está funcionando!');
});

/**
 * GET /estado
 * Busca todos os Estados com paginação, filtros e ordenação.
 */
ESTADO_ROTA.get('/listar', (req, res) => ESTADO_CONTROLADOR.buscarTodosEstados(req, res));

/**
 * GET /estado/:id
 * Busca um Estado pelo seu ID.
 */
ESTADO_ROTA.get('/:id', (req, res) => ESTADO_CONTROLADOR.buscarEstadoPorId(req, res));

/**
 * POST /estado
 * Cria um novo Estado.
 */
ESTADO_ROTA.post('/', (req, res) => ESTADO_CONTROLADOR.criarEstado(req, res));

/**
 * PUT /estado/:id
 * Atualiza um Estado existente pelo ID.
 */
ESTADO_ROTA.put('/:id', (req, res) => ESTADO_CONTROLADOR.atualizarEstado(req, res));

/**
 * DELETE /estado/:id
 * Remove um Estado pelo seu ID.
 */
ESTADO_ROTA.delete('/:id', (req, res) => ESTADO_CONTROLADOR.deletarEstado(req, res));

export default ESTADO_ROTA;
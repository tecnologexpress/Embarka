import { Router } from 'express';
import { ControladorMunicipio } from './controlador';
import { ServicoMunicipio } from './servico';

const SERVICO_MUNICIPIO = new ServicoMunicipio();
const CONTROLADOR = new ControladorMunicipio(SERVICO_MUNICIPIO);

const MUNICIPIO_ROTA = Router();

// estado/listar
MUNICIPIO_ROTA.get('/listar', (req, res) => CONTROLADOR.listarMunicipios(req, res));
MUNICIPIO_ROTA.post('/', (req, res) => CONTROLADOR.criarMunicipio(req, res));
MUNICIPIO_ROTA.delete('/:id', (req, res) => CONTROLADOR.deletarMunicipio(req, res));
MUNICIPIO_ROTA.get('/:id', (req, res) => CONTROLADOR.buscarMunicipioPorId(req, res));
MUNICIPIO_ROTA.put('/:id', (req, res) => CONTROLADOR.atualizarMunicipio(req, res));
MUNICIPIO_ROTA.get('/codigo-ibge/:codigo_ibge', (req, res) => CONTROLADOR.buscarMunicipioPorCodigoIbge(req, res));
MUNICIPIO_ROTA.get('/buscar-por-nome', (req, res) => CONTROLADOR.buscarMunicipioPorNome(req, res));
MUNICIPIO_ROTA.get('/uf-existe/:estado_abreviado', (req, res) => CONTROLADOR.ufExiste(req, res));

export default MUNICIPIO_ROTA;
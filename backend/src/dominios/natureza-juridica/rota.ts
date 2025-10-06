import { Router } from 'express';
import { ControladorNaturezaJuridica } from './controlador';
import { ServicoNaturezaJuridica } from './servico';
import { RepositorioNaturezaJuridica } from './repositorio';

const SERVICO_NATUREZA_JURIDICA = new ServicoNaturezaJuridica(new RepositorioNaturezaJuridica());
const CONTROLADOR_NATUREZA_JURIDICA = new ControladorNaturezaJuridica(SERVICO_NATUREZA_JURIDICA);

const ROTA_NATUREZA_JURIDICA = Router();

//  GET /natureza-juridica/pessoas/:descricao
//  Lista pessoas por natureza jurídica ('fisica' ou 'juridica')
ROTA_NATUREZA_JURIDICA.get(
    '/pessoas/:descricao',
    CONTROLADOR_NATUREZA_JURIDICA.buscarPessoasPorNatureza
);

export default ROTA_NATUREZA_JURIDICA;
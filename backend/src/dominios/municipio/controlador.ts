/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';
import { ServicoMunicipio } from './servico';
import { extrairFiltrosDaQuery } from '@/types/filtros-query';
import { TratarErro } from '@/infraestrutura/erros/tratar-erro';

export class ControladorMunicipio {
    constructor(
        private readonly servicoMunicipio: ServicoMunicipio
    ) { }

    async criarMunicipio(req: Request, res: Response) {
        try {
            const { CODIGO_IBGE, MUNICIPIO_TOM, MUNICIPIO_IBGE, ESTADO_ABREVIADO } = req.body;
            if (!this.servicoMunicipio) {
                return res.status(500).json({ erro: 'Serviço de município não está disponível' });
            }
            const MUNICIPIO = await this.servicoMunicipio.criarMunicipio(
                CODIGO_IBGE,
                MUNICIPIO_TOM,
                MUNICIPIO_IBGE,
                ESTADO_ABREVIADO
            );
            return res.status(201).json(MUNICIPIO);
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao criar município', detalhes: error });
        }
    }

    async deletarMunicipio(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);
            if (!this.servicoMunicipio) {
                return res.status(500).json({ erro: 'Serviço de município não está disponível' });
            }
            await this.servicoMunicipio.deletarMunicipio(ID);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao deletar município', detalhes: error });
        }
    }

    async buscarMunicipioPorId(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);
            if (!this.servicoMunicipio) {
                return res.status(500).json({ erro: 'Serviço de município não está disponível' });
            }
            const MUNICIPIO = await this.servicoMunicipio.buscarMunicipioPorId(ID);
            if (!MUNICIPIO) {
                return res.status(404).json({ erro: 'Município não encontrado' });
            }
            return res.json(MUNICIPIO);
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao buscar município', detalhes: error });
        }
    }

    async atualizarMunicipio(req: Request, res: Response) {
        try {
            const ID = Number(req.params.id);
            const { CODIGO_IBGE, MUNICIPIO_TOM, MUNICIPIO_IBGE, ESTADO_ABREVIADO } = req.body;
            if (!this.servicoMunicipio) {
                return res.status(500).json({ erro: 'Serviço de município não está disponível' });
            }
            const MUNICIPIO = await this.servicoMunicipio.atualizarMunicipio(
                ID,
                CODIGO_IBGE,
                MUNICIPIO_TOM,
                MUNICIPIO_IBGE,
                ESTADO_ABREVIADO
            );
            if (!MUNICIPIO) {
                return res.status(404).json({ erro: 'Município não encontrado' });
            }
            return res.json(MUNICIPIO);
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao atualizar município', detalhes: error });
        }
    }

    async listarMunicipios(req: Request, res: Response) {
        try {

            const { paginacao, filtros, ordenacao } = extrairFiltrosDaQuery(req.query);

            const RESULTADO = await this.servicoMunicipio.listarMunicipios(paginacao, filtros, ordenacao);
            return res.json(RESULTADO);
        } catch (error) {
            TratarErro(res, error, 'Erro ao listar municípios');
            return;
        }
    }

    async buscarMunicipioPorCodigoIbge(req: Request, res: Response) {
        try {
            const CODIGO_IBGE = Number(req.params.codigo_ibge);
            if (!this.servicoMunicipio) {
                return res.status(500).json({ erro: 'Serviço de município não está disponível' });
            }
            const MUNICIPIO = await this.servicoMunicipio.buscarMunicipioPorCodigoIbge(CODIGO_IBGE);
            if (!MUNICIPIO) {
                return res.status(404).json({ erro: 'Município não encontrado' });
            }
            return res.json(MUNICIPIO);
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao buscar município por código IBGE', detalhes: error });
        }
    }

    async buscarMunicipioPorNome(req: Request, res: Response) {
        try {
            const NOME = req.query.nome as string;
            const ESTADO_ABREVIADO = req.query.estado_abreviado as string;
            if (!this.servicoMunicipio) {
                return res.status(500).json({ erro: 'Serviço de município não está disponível' });
            }
            const MUNICIPIO = await this.servicoMunicipio.buscarMunicipioPorNome(NOME, ESTADO_ABREVIADO);
            if (!MUNICIPIO) {
                return res.status(404).json({ erro: 'Município não encontrado' });
            }
            return res.json(MUNICIPIO);
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao buscar município por nome', detalhes: error });
        }
    }

    async ufExiste(req: Request, res: Response) {
        try {
            const ESTADO_ABREVIADO = req.params.estado_abreviado;
            if (typeof ESTADO_ABREVIADO !== 'string') {
                return res.status(400).json({ erro: 'UF inválida ou não informada' });
            }
            if (!this.servicoMunicipio) {
                return res.status(500).json({ erro: 'Serviço de município não está disponível' });
            }
            const EXISTE = await this.servicoMunicipio.ufExiste(ESTADO_ABREVIADO);
            return res.json({ EXISTE });
        } catch (error) {
            return res.status(400).json({ erro: 'Erro ao verificar UF', detalhes: error });
        }
    }
}
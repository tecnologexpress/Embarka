import { Municipio } from './entidade/municipio';
import { RepositorioMunicipio } from './repositorio';
import { ResultadoPaginado } from '@/types/resultado-paginado';

export class ServicoMunicipio {
    constructor(
        private readonly repositorioMunicipio = new RepositorioMunicipio()
    ) { }

    async criarMunicipio(
        prm_codigo_ibge: number,
        prm_municipio_tom: string,
        prm_municipio_ibge: string,
        prm_estado_abreviado: string
    ): Promise<Municipio> {
        return await this.repositorioMunicipio.criarMunicipio(
            prm_codigo_ibge,
            prm_municipio_tom,
            prm_municipio_ibge,
            prm_estado_abreviado
        );
    }

    async deletarMunicipio(prm_id_municipio: number): Promise<void> {
        await this.repositorioMunicipio.deletarMunicipio(prm_id_municipio);
    }

    async buscarMunicipioPorId(prm_id_municipio: number): Promise<Municipio | null> {
        return await this.repositorioMunicipio.buscarMunicipioPorId(prm_id_municipio);
    }

    async atualizarMunicipio(
        prm_id_municipio: number,
        prm_codigo_ibge: number,
        prm_municipio_tom: string,
        prm_municipio_ibge: string,
        prm_estado_abreviado: string
    ): Promise<Municipio | null> {
        return await this.repositorioMunicipio.atualizarMunicipio(
            prm_id_municipio,
            prm_codigo_ibge,
            prm_municipio_tom,
            prm_municipio_ibge,
            prm_estado_abreviado
        );
    }

    async listarMunicipios(
        prm_paginacao: { pagina_atual: number; itens_por_pagina: number },
        prm_filtros: { termo_de_busca?: string; estado_abreviado?: string },
        prm_ordenacao: { ordenar_coluna?: string; ordenar_direcao?: 'ASC' | 'DESC' }
    ): Promise<ResultadoPaginado<Municipio>> {
        return await this.repositorioMunicipio.listarMunicipios(
            prm_paginacao,
            prm_filtros,
            prm_ordenacao
        );
    }

    async buscarMunicipioPorCodigoIbge(prm_codigo_ibge: number): Promise<Municipio | null> {
        return await this.repositorioMunicipio.buscarMunicipioPorCodigoIbge(prm_codigo_ibge);
    }

    async buscarMunicipioPorNome(prm_nome: string, prm_estado_abreviado: string): Promise<Municipio | null> {
        return await this.repositorioMunicipio.buscarMunicipioPorNome(prm_nome, prm_estado_abreviado);
    }

    async ufExiste(prm_estado_abreviado: string): Promise<boolean> {
        return await this.repositorioMunicipio.ufExiste(prm_estado_abreviado);
    }
}
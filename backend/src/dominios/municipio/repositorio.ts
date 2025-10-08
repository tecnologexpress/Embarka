import { ILike } from 'typeorm';
import { APP_DATA_SOURCE } from '../../infraestrutura/database';
import { Municipio } from './entidade/municipio';
import { ResultadoPaginado } from '@/types/resultado-paginado';

export class RepositorioMunicipio {
    constructor(
        private readonly repositorioMunicipio = APP_DATA_SOURCE.getRepository(Municipio),
    ) { }

    /**
     * Cria um novo município.
     * @param prm_codigo_ibge - Código IBGE do município
     * @param prm_municipio_tom - Nome do município (tom)
     * @param prm_municipio_ibge - Nome do município (IBGE)
     * @param prm_estado_abreviado - Unidade Federativa abreviada do município
     * @returns O município criado
     */
    async criarMunicipio(
        prm_codigo_ibge: number,
        prm_municipio_tom: string,
        prm_municipio_ibge: string,
        prm_estado_abreviado: string
    ): Promise<Municipio> {
        const MUNICIPIO = this.repositorioMunicipio.create({
            nr_codigo_ibge: prm_codigo_ibge,
            ds_municipio_ibge: prm_municipio_ibge,
            ds_municipio_tom: prm_municipio_tom,
            ds_estado_abreviado: prm_estado_abreviado
        });
        await this.repositorioMunicipio.save(MUNICIPIO);
        return MUNICIPIO;
    }

    /**
     * Deleta um município existente.
     * @param prm_id_municipio - ID do município a ser deletado
     * @returns void
     */
    async deletarMunicipio(prm_id_municipio: number): Promise<void> {
        await this.repositorioMunicipio.delete(prm_id_municipio);
    }

    /**
     * Busca um município pelo ID.
     * @param prm_id_municipio - ID do município a ser buscado
     * @returns O município encontrado ou null
     */
    async buscarMunicipioPorId(prm_id_municipio: number): Promise<Municipio | null> {
        return await this.repositorioMunicipio.findOne({
            where: { id_municipio: prm_id_municipio }
        });
    }

    /**
     * Atualiza um município existente.
     * @param prm_id_municipio - ID do município a ser atualizado
     * @param prm_codigo_ibge - Código IBGE do município
     * @param prm_municipio_tom - Nome do município (tom)
     * @param prm_municipio_ibge - Nome do município (IBGE)
     * @param prm_estado_abreviado - Unidade Federativa abreviada do município
     * @returns O município atualizado ou null
     */
    async atualizarMunicipio(
        prm_id_municipio: number,
        prm_codigo_ibge: number,
        prm_municipio_tom: string,
        prm_municipio_ibge: string,
        prm_estado_abreviado: string
    ): Promise<Municipio | null> {
        const MUNICIPIO = await this.repositorioMunicipio.findOne({ where: { id_municipio: prm_id_municipio } });
        if (!MUNICIPIO) return null;
        MUNICIPIO.nr_codigo_ibge = prm_codigo_ibge;
        MUNICIPIO.ds_municipio_tom = prm_municipio_tom;
        MUNICIPIO.ds_municipio_ibge = prm_municipio_ibge;
        MUNICIPIO.ds_estado_abreviado = prm_estado_abreviado;
        return await this.repositorioMunicipio.save(MUNICIPIO);
    }

    /**
     * Lista todos os municípios.
     * @param prm_paginacao - Parâmetros de paginação
     * @param prm_filtros - Filtros para a busca (termo_de_busca, estado abreviado)
     * @param prm_ordenacao - Parâmetros de ordenação
     * @returns Lista paginada de municípios
     */
    async listarMunicipios(
        prm_paginacao: { pagina_atual: number; itens_por_pagina: number },
        prm_filtros: { termo_de_busca?: string; estado_abreviado?: string },
        prm_ordenacao: { ordenar_coluna?: string; ordenar_direcao?: 'ASC' | 'DESC' }
    ): Promise<ResultadoPaginado<Municipio>> {
        const PAG = Math.max(1, Number(prm_paginacao?.pagina_atual ?? 1));
        const LIM = Math.min(1000, Math.max(1, Number(prm_paginacao?.itens_por_pagina ?? 50)));
        const TERMO = (prm_filtros?.termo_de_busca ?? '').trim() || undefined;
        const UF = (prm_filtros?.estado_abreviado ?? '').trim().toUpperCase() || undefined;

        const COLUNAS: Record<string, keyof Municipio> = {
            id_municipio: 'id_municipio',
            nr_codigo_ibge: 'nr_codigo_ibge',
            ds_municipio_ibge: 'ds_municipio_ibge',
            ds_estado_abreviado: 'ds_estado_abreviado',
        };
        // Prioriza ASC se o usuário não escolher
        const COL = prm_ordenacao?.ordenar_coluna ?? 'ds_municipio_ibge';
        const DIR = prm_ordenacao?.ordenar_direcao === 'DESC' ? 'DESC' : 'ASC';

        const WHERE: any[] = [];
        // ✅ filtro por UF
        if (UF) {
            WHERE.push({ ds_estado_abreviado: UF, ...(TERMO ? { ds_municipio_ibge: ILike(`%${TERMO}%`) } : {}) });
        } else if (TERMO) {
            // sem UF, busca só por nome
            WHERE.push({ ds_municipio_ibge: ILike(`%${TERMO}%`) });
        }

        const FIND_OPTIONS: any = {
            order: { [COLUNAS[COL] ?? 'ds_municipio_ibge']: DIR },
            skip: (PAG - 1) * LIM,
            take: LIM,
        };
        if (WHERE.length) {
            FIND_OPTIONS.where = WHERE;
        }

        const [ITENS, TOTAL] = await this.repositorioMunicipio.findAndCount(FIND_OPTIONS);

        return {
            resultados: ITENS,
            total_itens: TOTAL,
            pagina_atual: PAG,
            itens_por_pagina: LIM,
        };
    }

    /**
     * Busca um município pelo código IBGE.
     * @param prm_codigo_ibge - Código IBGE do município
     * @returns O município encontrado ou null
     */
    async buscarMunicipioPorCodigoIbge(prm_codigo_ibge: number): Promise<Municipio | null> {
        return await this.repositorioMunicipio.findOne({ where: { nr_codigo_ibge: prm_codigo_ibge } });
    }

    /**
     * Busca um município pelo nome e estado abreviado.
     * @param prm_nome - Nome do município
     * @param prm_estado_abreviado - Unidade Federativa abreviada do município
     * @returns O município encontrado ou null
     */
    async buscarMunicipioPorNome(prm_nome: string, prm_estado_abreviado: string): Promise<Municipio | null> {
        return await this.repositorioMunicipio.findOne({ where: { ds_municipio_ibge: prm_nome, ds_estado_abreviado: prm_estado_abreviado } });
    }

    /**
     * Verifica se uma Unidade Federativa abreviada existe.
     * @param prm_estado_abreviado - UF abreviada a ser verificada
     * @returns true se a UF existir, caso contrário false
     */
    async ufExiste(prm_estado_abreviado: string): Promise<boolean> {
        const MUNICIPIOS = await this.repositorioMunicipio.find({ where: { ds_estado_abreviado: prm_estado_abreviado } });
        return MUNICIPIOS.length > 0;
    }
}
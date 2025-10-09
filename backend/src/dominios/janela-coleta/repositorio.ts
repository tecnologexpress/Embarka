import { APP_DATA_SOURCE } from "@/infraestrutura/database";
import { JanelaDeColetaFornecedor } from "./entidade/janela-de-coleta-fornecedor.entidade";
import { ResultadoPaginado } from "@/types/resultado-paginado";

export class JanelaColetaRepositorio {
    constructor(
        private readonly repositorioJanela = APP_DATA_SOURCE.getRepository(JanelaDeColetaFornecedor)
    ) { }

    async criarJanelaDeColeta(prm_data: Partial<JanelaDeColetaFornecedor>) {
        return this.repositorioJanela.create(prm_data);
    }

    async salvarJanelaDeColeta(prm_ent: JanelaDeColetaFornecedor) {
        return this.repositorioJanela.save(prm_ent);
    }

    async atualizarJanelaDeColeta(prm_id: number, prm_data: Partial<JanelaDeColetaFornecedor>) {
        await this.repositorioJanela.update({ id_janela_de_coleta_fornecedor: prm_id }, prm_data);
        return this.obterJanelaDeColetaPorId(prm_id);
    }

    async removerJanelaDeColeta(prm_id: number) {
        await this.repositorioJanela.delete({ id_janela_de_coleta_fornecedor: prm_id });
    }

    async obterJanelaDeColetaPorId(prm_id: number) {
        return this.repositorioJanela.findOne({
            where: { id_janela_de_coleta_fornecedor: prm_id },
            relations: { fornecedor: false },
        });
    }

    async listarJanelas(
        prm_id_fornecedor?: number,
        prm_filtros?: {
            dia_da_semana?: string;
        }
    ): Promise<ResultadoPaginado<JanelaDeColetaFornecedor>> {

        const QUERY = this.repositorioJanela.createQueryBuilder("j");
        QUERY.andWhere("j.id_fornecedor = :idf", { idf: prm_id_fornecedor });

        if (prm_filtros && prm_filtros.dia_da_semana) {
            QUERY.andWhere("j.ds_dia_da_semana = :dia", { dia: prm_filtros.dia_da_semana.toUpperCase() });
        }

        const [REGISTROS, TOTAL] = await QUERY.getManyAndCount();

        return {
            resultados: REGISTROS,
            total_itens: TOTAL,
            pagina_atual: 1,
            itens_por_pagina: 10,
        };
    }
}

import { APP_DATA_SOURCE } from "@/infraestrutura/database";
import { Embarcador } from "./entidade/embarcador.entidade";

export class EmbarcadorRepositorio {
    constructor(
        private readonly embarcadorRepositorio = APP_DATA_SOURCE.getRepository(Embarcador)
    ) { }

    async salvarEmbarcador(prm_data: Partial<Embarcador>): Promise<Embarcador> {
        const NOVO_CLIENTE = this.embarcadorRepositorio.create(prm_data);
        return await this.embarcadorRepositorio.save(NOVO_CLIENTE);
    }

    async obterEmbarcadorPorIdPessoa(prm_id_pessoa: number): Promise<Embarcador | null> {
        return this.embarcadorRepositorio.findOne({
            where: { pessoa: { id_pessoa: prm_id_pessoa } },
            relations: ['pessoa'],
        });
    }

    async obterEmbarcadorPorIdEmbarcador(prm_id_embarcador: number): Promise<Embarcador | null> {
        return this.embarcadorRepositorio.findOneBy({ id_embarcador: prm_id_embarcador });
    }
}
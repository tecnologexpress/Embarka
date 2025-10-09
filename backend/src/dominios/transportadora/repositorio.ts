import { APP_DATA_SOURCE } from "@/infraestrutura/database";
import { Transportadora } from "./entidade/transportadora.entidade";

export class TransportadoraRepositorio {
    constructor(
        private readonly transporadoraRepositorio = APP_DATA_SOURCE.getRepository(Transportadora)
    ) { }

    async salvarTransportadora(prm_data: Partial<Transportadora>): Promise<Transportadora> {
        const NOVA_TRANSPORTADORA = this.transporadoraRepositorio.create(prm_data);
        return await this.transporadoraRepositorio.save(NOVA_TRANSPORTADORA);
    }

    async obterTransportadoraPorIdPessoa(prm_id_pessoa: number): Promise<Transportadora | null> {
        return this.transporadoraRepositorio.findOne({
            where: { pessoa: { id_pessoa: prm_id_pessoa } },
            relations: ['pessoa'],
        });
    }

    async obterTransportadoraPorIdTransportadora(prm_id_transportadora: number): Promise<Transportadora | null> {
        return this.transporadoraRepositorio.findOneBy({ id_transportadora: prm_id_transportadora });
    }
}
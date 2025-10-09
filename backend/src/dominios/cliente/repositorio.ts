import { APP_DATA_SOURCE } from "@/infraestrutura/database";
import { Cliente } from "./entidade/cliente.entidade";

export class ClienteRepositorio {
    constructor(
        private readonly clienteRepositorio = APP_DATA_SOURCE.getRepository(Cliente)
    ) { }

    async salvarCliente(prm_data: Partial<Cliente>): Promise<Cliente> {
        const NOVO_CLIENTE = this.clienteRepositorio.create(prm_data);
        return await this.clienteRepositorio.save(NOVO_CLIENTE);
    }

    async obterClientePorIdPessoa(prm_id_pessoa: number): Promise<Cliente | null> {
        return this.clienteRepositorio.findOne({
            where: { pessoa: { id_pessoa: prm_id_pessoa } },
            relations: ['pessoa'],
        });
    }

    async obterClientePorIdCliente(prm_id_cliente: number): Promise<Cliente | null> {
        return this.clienteRepositorio.findOneBy({ id_cliente: prm_id_cliente });
    }
}
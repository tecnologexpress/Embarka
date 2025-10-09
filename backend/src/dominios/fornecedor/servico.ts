import { Fornecedor } from './entidade/fornecedor.entidade';
import { FornecedorRepositorio } from './repositorio';

export class FornecedorServico {
    constructor(
        private readonly fornecedorRepositorio: FornecedorRepositorio
    ) { }

    async listarFornecedores(): Promise<Fornecedor[]> {
        return await this.fornecedorRepositorio.listarFornecedores();
    }

    async buscarFornecedorPorId(prm_id: number): Promise<Fornecedor | null> {
        return await this.fornecedorRepositorio.buscarFornecedorPorId(prm_id);
    }

    async criarFornecedor(prm_data: Fornecedor): Promise<Fornecedor> {
        return await this.fornecedorRepositorio.salvarFornecedor(prm_data);
    }
}
import { Fornecedor } from './entidade/entidade';
import { APP_DATA_SOURCE } from '@/infraestrutura/database';

export class FornecedorRepositorio {
  constructor(
    private readonly fornecedorRepositorio = APP_DATA_SOURCE.getRepository(Fornecedor)
  ) { }

  async listarFornecedores(): Promise<Fornecedor[]> {
    return await this.fornecedorRepositorio.find();
  }

  async buscarFornecedorPorId(prm_id: number): Promise<Fornecedor | null> {
    return await this.fornecedorRepositorio.findOneBy({ id_fornecedor: prm_id });
  }

  async criarFornecedor(prm_data: Fornecedor): Promise<Fornecedor> {
    const NOVO_FORNECEDOR = this.fornecedorRepositorio.create(prm_data);
    return await this.fornecedorRepositorio.save(NOVO_FORNECEDOR);
  }
}
import { Pessoa } from './entidade/entidade';
import { APP_DATA_SOURCE } from '@/infraestrutura/database';

export class RepositorioPessoa {
  constructor(
    private repositorioPessoa = APP_DATA_SOURCE.getRepository(Pessoa)
  ) { }

  async salvarPessoa(prm_pessoa: Pessoa): Promise<Pessoa> {
    return await this.repositorioPessoa.save(prm_pessoa);
  }
}
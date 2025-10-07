import { Pessoa } from './entidade/pessoa.entidade';
import { APP_DATA_SOURCE } from '@/infraestrutura/database';
import { Repository } from 'typeorm';
import { PessoaAcesso } from './entidade/pessoa-acesso.entidade';

export class PessoaRepositorio {
  constructor(
    private readonly pessoaRepositorio: Repository<Pessoa> = APP_DATA_SOURCE.getRepository(Pessoa),
    private readonly pessoaAcessoRepositorio: Repository<PessoaAcesso> = APP_DATA_SOURCE.getRepository(PessoaAcesso)
  ) { }

  async emailJaCadastrado(prm_email: string): Promise<boolean> {
    const PESSOA = await this.pessoaRepositorio.findOne({ where: { ds_email: prm_email } });
    return !!PESSOA;
  }

  async cnpjJaCadastrado(prm_cnpj: string): Promise<boolean> {
    const PESSOA = await this.pessoaRepositorio.findOne({ where: { ds_documento: prm_cnpj } });
    return !!PESSOA;
  }

  /**
   * Salva a entidade Pessoa e, em cascata, a entidade PessoaAcesso relacionada.
   * @param prm_pessoa A entidade Pessoa com a propriedade pessoaAcesso preenchida.
   * @returns A entidade Pessoa salva.
   */
  async salvarPessoa(prm_pessoa: Pessoa): Promise<Pessoa> {
    // O TypeORM salvará Pessoa e PessoaAcesso em uma única transação devido ao cascade: true
    return await this.pessoaRepositorio.save(prm_pessoa);
  }

  // O método salvarAcessoPessoa se torna desnecessário se usarmos a cascata
  async salvarPessoaAcesso(prm_pessoa_acesso: PessoaAcesso): Promise<PessoaAcesso> {
    return await this.pessoaAcessoRepositorio.save(prm_pessoa_acesso);
  }

  async obterSenhaHashPorEmail(prm_email: string): Promise<string | null> {
    const PESSOA = await this.pessoaRepositorio.findOne({
      where: { ds_email: prm_email },
      select: ['pessoaAcesso'],
      relations: ['pessoaAcesso'],
    });

    return PESSOA?.pessoaAcesso?.ds_senha_hash || null;
  }

  async obterPessoaPorEmail(prm_email: string): Promise<Pessoa | null> {
    const PESSOA = await this.pessoaRepositorio.findOne({
      where: { ds_email: prm_email },
      relations: ['pessoaAcesso']
    });

    return PESSOA || null;
  }

  async obterPessoaPorId(prm_id_pessoa: number): Promise<Pessoa | null> {
    const PESSOA = await this.pessoaRepositorio.findOne({
      where: { id_pessoa: prm_id_pessoa },
      relations: ['pessoaAcesso']
    });

    return PESSOA || null;
  }

  async verificarRolePessoa(prm_email: string): Promise<string> {
    const PESSOA = await this.pessoaRepositorio.findOne({
      where: { ds_email: prm_email },
      select: ['pessoaAcesso'],
      relations: ['pessoaAcesso']
    });

    let role: string = "";

    if (PESSOA?.fornecedor) {
      role = "fornecedor";
    }

    // TO-DO: Futuramente, implementar um switch-case com outras roles como transportadora, embarcador ou cliente.
    // if (PESSOA?.cliente) {
    //   role = "cliente";
    // }

    // if (PESSOA?.transportadora) {
    //   role = "transportadora";
    // }

    // if (PESSOA?.embarcador) {
    //   role = "embarcador";
    // }

    return role;
  }
}

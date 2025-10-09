import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Estado } from '../../estado/entidade/estado';
import { Municipio } from '../../municipio/entidade/municipio';
import { Fornecedor } from '@/dominios/fornecedor/entidade/fornecedor.entidade';
import { PessoaAcesso } from './pessoa-acesso.entidade';
import { Embarcador } from '@/dominios/embarcador/entidade/embarcador.entidade';
import { Cliente } from '@/dominios/cliente/entidade/cliente.entidade';
import { Transportadora } from '@/dominios/transportadora/entidade/transportadora.entidade';

/**
 * Representa a entidade Pessoa no sistema.
 * 
 * @remarks
 * Esta classe mapeia a tabela 'pessoa' no banco de dados, contendo informações pessoais,
 * dados de contato, endereço, redes sociais e relacionamentos com outras entidades.
 * 
 * @property {number} id_pessoa - Identificador único da pessoa.
 * @property {string} ds_documento - Documento de identificação (CPF/CNPJ), único.
 * @property {string} ds_descricao - Nome ou descrição da pessoa.
 * @property {string} [ds_tratamento] - Tratamento ou título da pessoa (opcional).
 * @property {Date} dt_origem - Data de origem ou cadastro da pessoa.
 * @property {string} ds_email - E-mail da pessoa.
 * @property {string} ds_telefone - Telefone fixo da pessoa.
 * @property {string} [ds_celular] - Celular da pessoa (opcional).
 * @property {string} ds_pais - País de residência.
 * @property {string} ds_estado - Estado de residência.
 * @property {number} nr_codigo_ibge - Código IBGE do município.
 * @property {string} ds_bairro - Bairro de residência.
 * @property {number} ds_cep - CEP do endereço.
 * @property {string} ds_endereco - Endereço da residência.
 * @property {string} ds_endereco_numero - Número do endereço.
 * @property {string} [ds_complemento] - Complemento do endereço (opcional).
 * @property {string} [ds_site] - Site pessoal ou institucional (opcional).
 * @property {string} [ds_instagram] - Perfil do Instagram (opcional).
 * @property {string} [ds_linkedin] - Perfil do LinkedIn (opcional).
 * @property {string} [ds_twitter] - Perfil do Twitter (opcional).
 * @property {string} [ds_facebook] - Perfil do Facebook (opcional).
 * @property {string} [ds_inscricao_estadual] - Inscrição estadual (opcional).
 * @property {Date} dh_criado_em - Data/hora de criação do registro.
 * @property {Date} dh_atualizado_em - Data/hora da última atualização do registro.
 * @property {NaturezaJuridica} natureza_juridica - Natureza jurídica associada.
 * @property {number} id_natureza_juridica - Identificador da natureza jurídica.
 * @property {Estado} estado - Estado associado.
 * @property {number} id_estado - Identificador do estado.
 * @property {Municipio} municipio - Município associado.
 * @property {number} nr_municipio - Identificador do município.
 * @property {PessoaTipoRelacao[]} pessoa_tipo_relacoes - Relações de tipos de pessoa.
 */
@Entity('pessoa')
export class Pessoa {
  @PrimaryGeneratedColumn()
  id_pessoa!: number;

  @Column({ type: 'varchar', length: 14, nullable: false, unique: true })
  ds_documento!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  ds_descricao!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ds_tratamento?: string;

  @Column({ type: 'date', nullable: false })
  dt_origem!: Date;

  @Column({ type: 'varchar', length: 100, nullable: false })
  ds_email!: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  ds_telefone!: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  ds_celular?: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  ds_pais!: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  ds_estado_abreviado!: string;

  @Column({ type: 'integer', nullable: false })
  nr_codigo_ibge!: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  ds_bairro!: string;

  @Column({ type: 'integer', nullable: false })
  ds_cep!: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  ds_endereco!: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  ds_endereco_numero!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ds_complemento?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  ds_site?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  ds_instagram?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  ds_linkedin?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  ds_twitter?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  ds_facebook?: string;

  @Column({ type: 'varchar', nullable: true })
  ds_inscricao_estadual?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dh_criado_em!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dh_atualizado_em!: Date;

  @ManyToOne(() => Estado, prm_estado => prm_estado.pessoas)
  @JoinColumn({ name: 'ds_estado_abreviado', referencedColumnName: 'ds_estado_abreviado' })
  estado!: Estado;

  @ManyToOne(() => Municipio, prm_municipio => prm_municipio.pessoas)
  @JoinColumn({ name: 'nr_codigo_ibge', referencedColumnName: 'nr_codigo_ibge' })
  municipio!: Municipio;

  @OneToOne(() => Fornecedor, prm_fornecedor => prm_fornecedor.pessoa)
  fornecedor?: Fornecedor;

  @OneToOne(() => Embarcador, prm_embarcador => prm_embarcador.pessoa)
  embarcador?: Embarcador;

  @OneToOne(() => Cliente, prm_cliente => prm_cliente.pessoa)
  cliente?: Cliente;

  @OneToOne(() => Transportadora, prm_transportadora => prm_transportadora.pessoa)
  transportadora?: Transportadora;

  @OneToOne(() => PessoaAcesso, prm_pessoa_acesso => prm_pessoa_acesso.pessoa)
  pessoaAcesso!: PessoaAcesso;
}

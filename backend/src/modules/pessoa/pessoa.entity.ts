import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany,
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Municipio } from '../municipio/municipio.entity';
import { PessoaNaturezaJuridica } from '../pessoa-natureza/pessoa-natureza.entity';

/**
 * Entidade Pessoa - Representa pessoas físicas e jurídicas
 * @description Armazena informações completas de pessoas com relacionamentos
 */
@Entity('pessoa')
export class Pessoa {
  /**
   * Identificador único da pessoa
   * @example 1
   */
  @ApiProperty({
    description: 'Identificador único da pessoa',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment', { name: 'id_pessoa' })
  id: number;

  /**
   * Documento da pessoa (CPF/CNPJ)
   * @example "12345678901"
   */
  @ApiProperty({
    description: 'Documento da pessoa (CPF/CNPJ)',
    example: '12345678901',
    maxLength: 14,
  })
  @Column({ name: 'ds_documento', type: 'varchar', length: 14, nullable: false })
  documento: string;

  /**
   * Descrição/Observações sobre a pessoa
   * @example "Cliente VIP"
   */
  @ApiProperty({
    description: 'Descrição ou observações',
    example: 'Cliente VIP',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_descricao', type: 'varchar', length: 50, nullable: true })
  descricao: string;

  /**
   * Tratamento da pessoa (Sr./Sra./Dr./etc)
   * @example "Sr."
   */
  @ApiProperty({
    description: 'Tratamento da pessoa',
    example: 'Sr.',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_tratamento', type: 'varchar', length: 50, nullable: true })
  tratamento: string;

  /**
   * Email da pessoa
   * @example "pessoa@email.com"
   */
  @ApiProperty({
    description: 'Email da pessoa',
    example: 'pessoa@email.com',
    maxLength: 50,
  })
  @Column({ name: 'ds_email', type: 'varchar', length: 50, nullable: false })
  email: string;

  /**
   * Origem da pessoa/cliente
   * @example "Indicação"
   */
  @ApiProperty({
    description: 'Origem da pessoa',
    example: 'Indicação',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'dt_origem', type: 'varchar', length: 50, nullable: true })
  origem: string;

  /**
   * Telefone da pessoa
   * @example "(11) 99999-9999"
   */
  @ApiProperty({
    description: 'Telefone da pessoa',
    example: '(11) 99999-9999',
    maxLength: 10,
    nullable: true,
  })
  @Column({ name: 'ds_telefone', type: 'varchar', length: 10, nullable: true })
  telefone: string;

  /**
   * Celular da pessoa
   * @example "(11) 99999-9999"
   */
  @ApiProperty({
    description: 'Celular da pessoa',
    example: '(11) 99999-9999',
    maxLength: 11,
    nullable: true,
  })
  @Column({ name: 'ds_celular', type: 'varchar', length: 11, nullable: true })
  celular: string;

  /**
   * País da pessoa
   * @example "Brasil"
   */
  @ApiProperty({
    description: 'País da pessoa',
    example: 'Brasil',
    maxLength: 30,
    nullable: true,
  })
  @Column({ name: 'ds_pais', type: 'varchar', length: 30, nullable: true })
  pais: string;

  /**
   * Estado da pessoa
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Estado da pessoa',
    example: 'São Paulo',
    maxLength: 20,
    nullable: true,
  })
  @Column({ name: 'ds_estado', type: 'varchar', length: 20, nullable: true })
  estado: string;

  /**
   * Código IBGE do município
   */
  @ApiProperty({
    description: 'Código IBGE do município',
    example: 3550308,
    nullable: true,
  })
  @Column({ name: 'nr_codigo_ibge', type: 'integer', nullable: true })
  codigoIbge: number;

  /**
   * Bairro da pessoa
   * @example "Centro"
   */
  @ApiProperty({
    description: 'Bairro da pessoa',
    example: 'Centro',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_bairro', type: 'varchar', length: 50, nullable: true })
  bairro: string;

  /**
   * CEP da pessoa
   * @example "01234-567"
   */
  @ApiProperty({
    description: 'CEP da pessoa',
    example: '01234-567',
    nullable: true,
  })
  @Column({ name: 'ds_cep', type: 'integer', nullable: true })
  cep: number;

  /**
   * Endereço da pessoa
   * @example "Rua das Flores, 123"
   */
  @ApiProperty({
    description: 'Endereço da pessoa',
    example: 'Rua das Flores, 123',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_endereco', type: 'varchar', length: 50, nullable: true })
  endereco: string;

  /**
   * Número do endereço
   * @example "123"
   */
  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
    maxLength: 10,
    nullable: true,
  })
  @Column({ name: 'ds_endereco_numero', type: 'varchar', length: 10, nullable: true })
  numero: string;

  /**
   * Complemento do endereço
   * @example "Apt 45"
   */
  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Apt 45',
    maxLength: 30,
    nullable: true,
  })
  @Column({ name: 'ds_complemento', type: 'varchar', length: 30, nullable: true })
  complemento: string;

  /**
   * Site da pessoa/empresa
   * @example "www.empresa.com.br"
   */
  @ApiProperty({
    description: 'Site da pessoa/empresa',
    example: 'www.empresa.com.br',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_site', type: 'varchar', length: 50, nullable: true })
  site: string;

  /**
   * Instagram da pessoa/empresa
   * @example "@usuario"
   */
  @ApiProperty({
    description: 'Instagram da pessoa/empresa',
    example: '@usuario',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_instagram', type: 'varchar', length: 50, nullable: true })
  instagram: string;

  /**
   * LinkedIn da pessoa/empresa
   * @example "linkedin.com/in/usuario"
   */
  @ApiProperty({
    description: 'LinkedIn da pessoa/empresa',
    example: 'linkedin.com/in/usuario',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_linkedin', type: 'varchar', length: 50, nullable: true })
  linkedin: string;

  /**
   * Twitter da pessoa/empresa
   * @example "@usuario"
   */
  @ApiProperty({
    description: 'Twitter da pessoa/empresa',
    example: '@usuario',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_twitter', type: 'varchar', length: 50, nullable: true })
  twitter: string;

  /**
   * Facebook da pessoa/empresa
   * @example "facebook.com/usuario"
   */
  @ApiProperty({
    description: 'Facebook da pessoa/empresa',
    example: 'facebook.com/usuario',
    maxLength: 50,
    nullable: true,
  })
  @Column({ name: 'ds_facebook', type: 'varchar', length: 50, nullable: true })
  facebook: string;

  /**
   * Inscrição estadual da empresa
   * @example "123.456.789.012"
   */
  @ApiProperty({
    description: 'Inscrição estadual',
    example: '123.456.789.012',
    maxLength: 20,
    nullable: true,
  })
  @Column({ name: 'ds_inscricao_estadual', type: 'varchar', length: 20, nullable: true })
  inscricaoEstadual: string;

  /**
   * Município da pessoa
   */
  @ApiProperty({
    description: 'Município da pessoa',
    type: () => Municipio,
  })
  @ManyToOne(() => Municipio, (municipio) => municipio.pessoas, { nullable: true })
  @JoinColumn({ name: 'nr_codigo_ibge' })
  municipio: Municipio;

  /**
   * Naturezas jurídicas da pessoa (através de tabela pivot)
   */
  @ApiProperty({
    description: 'Naturezas jurídicas da pessoa',
    type: () => [PessoaNaturezaJuridica],
  })
  @OneToMany(() => PessoaNaturezaJuridica, (pessoaNatureza) => pessoaNatureza.pessoa, { 
    cascade: true,
    eager: true 
  })
  naturezas: PessoaNaturezaJuridica[];

  /**
   * Data de criação do registro
   */
  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ name: 'dh_criado_em' })
  criadoEm: Date;

  /**
   * Data da última atualização do registro
   */
  @ApiProperty({
    description: 'Data da última atualização',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'dh_atualizado_em' })
  atualizadoEm: Date;
}
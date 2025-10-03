import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Estado } from '../estado/estado.entity';
import { Pessoa } from '../pessoa/pessoa.entity';

/**
 * Entidade Municipio - Representa os municípios brasileiros
 * @description Armazena informações dos municípios com relacionamento com estados e pessoas
 */
@Entity('municipio')
export class Municipio {
  /**
   * Identificador único do município
   * @example 1
   */
  @ApiProperty({
    description: 'Identificador único do município',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment', { name: 'id_municipio' })
  id: number;

  /**
   * Código IBGE do município
   * @example 3550308
   */
  @ApiProperty({
    description: 'Código IBGE do município',
    example: 3550308,
    nullable: true,
  })
  @Column({ name: 'nr_codigo_ibge', type: 'integer', nullable: true })
  codigoIbge: number;

  /**
   * Nome do município
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Nome do município',
    example: 'São Paulo',
    maxLength: 100,
  })
  @Column({ name: 'ds_municipio_tom', type: 'varchar', length: 100, nullable: false })
  nome: string;

  /**
   * Nome completo/oficial do município
   * @example "Município de São Paulo"
   */
  @ApiProperty({
    description: 'Nome oficial do município',
    example: 'Município de São Paulo',
    maxLength: 150,
  })
  @Column({ name: 'ds_municipio_lbge', type: 'varchar', length: 150, nullable: true })
  nomeOficial: string;

  /**
   * UF (Unidade Federativa) do município
   * @example "SP"
   */
  @ApiProperty({
    description: 'UF do município',
    example: 'SP',
    maxLength: 2,
  })
  @Column({ name: 'ds_uf', type: 'varchar', length: 2, nullable: false })
  uf: string;

  /**
   * Latitude do município
   * @example -23.5505
   */
  @ApiProperty({
    description: 'Latitude do município',
    example: -23.5505,
    nullable: true,
  })
  @Column({ name: 'ds_latitude', type: 'varchar', length: 20, nullable: true })
  latitude: string;

  /**
   * Longitude do município
   * @example -46.6333
   */
  @ApiProperty({
    description: 'Longitude do município',
    example: -46.6333,
    nullable: true,
  })
  @Column({ name: 'ds_longitude', type: 'varchar', length: 20, nullable: true })
  longitude: string;

  /**
   * Estado ao qual o município pertence
   */
  @ApiProperty({
    description: 'Estado do município',
    type: () => Estado,
  })
  @ManyToOne(() => Estado, (estado) => estado.municipios)
  @JoinColumn({ name: 'nr_codigo_ibge_estado' })
  estado: Estado;

  /**
   * Lista de pessoas residentes no município
   */
  @ApiProperty({
    description: 'Lista de pessoas do município',
    type: () => [Pessoa],
  })
  @OneToMany(() => Pessoa, (pessoa) => pessoa.municipio)
  pessoas: Pessoa[];

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
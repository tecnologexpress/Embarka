import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Municipio } from '../municipio/municipio.entity';

/**
 * Entidade Estado - Representa os estados brasileiros
 * @description Armazena informações dos estados com relacionamento com municípios
 */
@Entity('estado')
export class Estado {
  /**
   * Identificador único do estado
   * @example 1
   */
  @ApiProperty({
    description: 'Identificador único do estado',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment', { name: 'id_estado' })
  id: number;

  /**
   * Nome do estado
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Nome do estado',
    example: 'São Paulo',
    maxLength: 21,
  })
  @Column({ name: 'ds_estado', type: 'varchar', length: 21, nullable: false })
  nome: string;

  /**
   * Sigla/abreviação do estado
   * @example "SP"
   */
  @ApiProperty({
    description: 'Sigla do estado',
    example: 'SP',
    maxLength: 2,
  })
  @Column({ name: 'ds_estado_abreviado', type: 'varchar', length: 2, nullable: false })
  sigla: string;

  /**
   * Lista de municípios pertencentes ao estado
   */
  @ApiProperty({
    description: 'Lista de municípios do estado',
    type: () => [Municipio],
  })
  @OneToMany(() => Municipio, (municipio) => municipio.estado)
  municipios: Municipio[];

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
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PessoaNaturezaJuridica } from '../pessoa-natureza/pessoa-natureza.entity';

/**
 * Entidade que representa uma Natureza Jurídica
 * @description Define os tipos de natureza jurídica (Física ou Jurídica)
 */
@Entity('natureza_juridica')
export class NaturezaJuridica {
  /**
   * Identificador único da natureza jurídica
   * @example 1
   */
  @ApiProperty({
    description: 'Identificador único da natureza jurídica',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Descrição da natureza jurídica
   * @example "Pessoa Física"
   */
  @ApiProperty({
    description: 'Descrição da natureza jurídica',
    example: 'Pessoa Física',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  descricao: string;

  /**
   * Código da natureza jurídica
   * @example "F"
   */
  @ApiProperty({
    description: 'Código da natureza jurídica (F-Física, J-Jurídica)',
    example: 'F',
    maxLength: 1,
  })
  @Column({ type: 'char', length: 1, nullable: false, unique: true })
  codigo: string;

  /**
   * Indica se a natureza está ativa
   * @example true
   */
  @ApiProperty({
    description: 'Indica se a natureza está ativa',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  ativa: boolean;

  /**
   * Data de criação do registro
   */
  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  /**
   * Data da última atualização do registro
   */
  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  /**
   * Relacionamento com pessoas que possuem esta natureza jurídica
   */
  @OneToMany(() => PessoaNaturezaJuridica, (pessoaNatureza) => pessoaNatureza.naturezaJuridica)
  pessoasNatureza: PessoaNaturezaJuridica[];
}
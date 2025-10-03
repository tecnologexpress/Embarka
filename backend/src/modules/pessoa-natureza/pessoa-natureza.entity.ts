import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Pessoa } from '../pessoa/pessoa.entity';
import { NaturezaJuridica } from '../natureza-juridica/natureza-juridica.entity';

/**
 * Entidade que representa a relação entre Pessoa e Natureza Jurídica (tabela pivot)
 * @description Tabela de relacionamento N:N entre pessoas e naturezas jurídicas
 */
@Entity('pessoa_natureza_juridica')
export class PessoaNaturezaJuridica {
  /**
   * Identificador único do relacionamento
   * @example 1
   */
  @ApiProperty({
    description: 'Identificador único do relacionamento',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'id_pessoa_natureza_juridica' })
  id: number;

  /**
   * ID da pessoa
   * @example 1
   */
  @ApiProperty({
    description: 'ID da pessoa',
    example: 1,
  })
  @Column({ name: 'id_pessoa', type: 'integer' })
  pessoaId: number;

  /**
   * ID da natureza jurídica
   * @example 1
   */
  @ApiProperty({
    description: 'ID da natureza jurídica',
    example: 1,
  })
  @Column({ name: 'id_natureza_juridica', type: 'integer' })
  naturezaJuridicaId: number;

  /**
   * Data de criação do relacionamento
   */
  @ApiProperty({
    description: 'Data de criação do relacionamento',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  /**
   * Data da última atualização do relacionamento
   */
  @ApiProperty({
    description: 'Data da última atualização do relacionamento',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  /**
   * Relacionamento com a pessoa
   */
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.naturezas, { 
    onDelete: 'CASCADE' // Quando a pessoa for excluída, as naturezas também serão
  })
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  /**
   * Relacionamento com a natureza jurídica
   */
  @ManyToOne(() => NaturezaJuridica, (natureza) => natureza.pessoasNatureza)
  @JoinColumn({ name: 'id_natureza_juridica' })
  naturezaJuridica: NaturezaJuridica;
}
import { Pessoa } from '@/dominios/pessoa/entidade/entidade';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('pessoa_natureza_juridica')
export class PessoaNaturezaJuridica {
    @PrimaryGeneratedColumn()
    id_pessoa_natureza_juridica!: number;

    @Column({ type: 'integer', nullable: false })
    id_natureza_juridica!: number;

    @Column({ type: 'integer', nullable: false })
    id_pessoa!: number;

    @OneToMany(() => Pessoa, prm_pessoa => prm_pessoa.pessoaNaturezaJuridica, { cascade: true, onDelete: 'CASCADE' })
    pessoas!: Pessoa[];
}
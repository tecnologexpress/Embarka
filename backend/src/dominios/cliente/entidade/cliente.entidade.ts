import { Pessoa } from '@/dominios/pessoa/entidade/pessoa.entidade';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';

@Entity('cliente')
export class Cliente {
    @PrimaryGeneratedColumn()
    id_cliente!: number;

    @Column({ type: 'integer', name: 'id_pessoa' })
    id_pessoa!: number;

    @JoinColumn({ name: 'id_pessoa', referencedColumnName: 'id_pessoa' })
    @OneToOne(() => Pessoa, prm_pessoa => prm_pessoa.cliente, { onDelete: 'CASCADE' })
    pessoa!: Pessoa;
}
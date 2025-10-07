import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { Pessoa } from './pessoa.entidade';

@Entity('pessoa_acesso')
export class PessoaAcesso {
    @PrimaryGeneratedColumn()
    id_pessoa_acesso!: number;

    @Column({ type: 'integer', nullable: false, unique: true })
    id_pessoa!: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    ds_senha_hash!: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    ds_email!: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dh_criado_em!: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dh_atualizado_em!: Date;

    @OneToOne(() => Pessoa, prm_pessoa => prm_pessoa.pessoaAcesso, { cascade: true })
    @JoinColumn({ name: 'id_pessoa', referencedColumnName: 'id_pessoa' })
    pessoa!: Pessoa;
}

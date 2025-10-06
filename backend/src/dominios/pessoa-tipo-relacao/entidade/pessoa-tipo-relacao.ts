import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Pessoa } from '../../pessoa/entidade/entidade';
import { PessoaTipo } from './pessoa-tipo';

@Entity('pessoa_tipo_relacao')
export class PessoaTipoRelacao {
    @PrimaryGeneratedColumn('increment')
    id_pessoa_tipo_relacao!: number;

    @OneToOne(() => PessoaTipo, prm_pessoa_tipo => prm_pessoa_tipo.pessoa_tipo_relacoes)
    @JoinColumn({ name: 'id_pessoa_tipo' })
    pessoa_tipo!: PessoaTipo;

    @Column({ type: 'integer', nullable: false })
    id_pessoa_tipo!: number;

    @OneToOne(() => Pessoa, prm_pessoa => prm_pessoa.pessoa_tipo_relacoes)
    @JoinColumn({ name: 'id_pessoa' })
    pessoa!: Pessoa;

    @Column({ type: 'integer', nullable: false })
    id_pessoa!: number;
}
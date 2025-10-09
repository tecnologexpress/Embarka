import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Pessoa } from "@/dominios/pessoa/entidade/pessoa.entidade";

@Entity({ name: "pessoa_recuperacao_de_senha" })
export class PessoaRecuperacaoSenha {
    @PrimaryGeneratedColumn()
    id_pessoa_recuperacao_de_senha!: number;

    @Column()
    id_pessoa!: number;

    // hash do token
    @Column({ type: "varchar", length: 255 })
    ds_token_hash!: string;

    // quando expira
    @Column({ type: "timestamptz" })
    dh_expira_em!: Date;

    // IP que solicitou (auditoria)
    @Column({ type: "varchar", length: 64, nullable: false })
    ds_ip_solicitante!: string | null;

    // quando foi usado (null = ainda não)
    @Column({ type: "timestamptz", nullable: true })
    dh_usado_em!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    dh_criado_em!: Date;

    @ManyToOne(() => Pessoa, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_pessoa" })
    pessoa!: Pessoa;
}

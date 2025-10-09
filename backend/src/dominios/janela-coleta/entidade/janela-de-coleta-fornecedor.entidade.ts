import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from "typeorm";
import { Fornecedor } from "@/dominios/fornecedor/entidade/fornecedor.entidade";

/**
 * Tabela: JANELA_DE_COLETA_FORNECEDOR
 * Guarda dia da semana, janela de horário e intervalo (opcional) para um fornecedor.
 */
@Entity("janela_de_coleta_fornecedor")
export class JanelaDeColetaFornecedor {
    @PrimaryGeneratedColumn({ name: "id_janela_de_coleta_fornecedor" })
    id_janela_de_coleta_fornecedor!: number;

    @Index()
    @Column({ name: "id_fornecedor", type: "int", nullable: false })
    id_fornecedor!: number;

    @Index()
    @Column({ name: "ds_dia_da_semana", type: "varchar", length: 13, nullable: false })
    ds_dia_da_semana!: string; // EX.: SEGUNDA, TERCA, ...

    @Column({ name: "hr_horario_inicio", type: "varchar", length: 10, nullable: false })
    hr_horario_inicio!: string; // HH:mm ou HH:mm:ss

    @Column({ name: "hr_horario_fim", type: "varchar", length: 10, nullable: false })
    hr_horario_fim!: string; // HH:mm ou HH:mm:ss

    @Column({ name: "hr_horario_intervalo_inicio", type: "varchar", length: 10, nullable: true })
    hr_horario_intervalo_inicio?: string | null;

    @Column({ name: "hr_horario_intervalo_fim", type: "varchar", length: 10, nullable: true })
    hr_horario_intervalo_fim?: string | null;

    @CreateDateColumn({
        name: "dh_criado_em",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    dh_criado_em!: Date;

    @UpdateDateColumn({
        name: "dh_atualizado_em",
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP",
    })
    dh_atualizado_em!: Date;

    @ManyToOne(() => Fornecedor, prm_f => prm_f.janelasColeta, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_fornecedor", referencedColumnName: "id_fornecedor" })
    fornecedor!: Fornecedor;
}

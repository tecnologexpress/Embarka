import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity("pessoa_otp")
export class PessoaOtp {
  @PrimaryGeneratedColumn()
  id_pessoa_otp!: number;

  @Index()
  @Column({ type: "int" })
  id_pessoa!: number;

  @Column({ type: "varchar", length: 255 })
  ds_codigo_hash!: string;

  @Column({ type: "timestamptz" })
  dh_expira_em!: Date;

  @Column({ type: "int", default: 0 })
  nr_tentativas!: number;

  @Column({ type: "boolean", default: false })
  bl_usado!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  dh_criado_em!: Date;
}

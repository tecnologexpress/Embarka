import { Municipio } from "@/dominios/municipio/entidade/municipio";
import { Pessoa } from "@/dominios/pessoa/entidade/pessoa.entidade";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

/**
 * Entidade que representa uma Unidade Federativa (UF).
 * Mapeia a tabela "estado" no banco de dados.
 */
@Entity("estado")
export class Estado {
    @PrimaryGeneratedColumn({ name: "id_estado" })
    id_estado!: number;

    @Column({ type: "varchar", length: 21, unique: true, name: "ds_estado" })
    ds_estado!: string;

    @Column({ type: "varchar", length: 2, unique: true, name: "ds_estado_abreviado" })
    ds_estado_abreviado!: string;

    @OneToMany(() => Municipio, prm_municipio => prm_municipio.estado)
    municipios!: Municipio[];

    @OneToMany(() => Pessoa, prm_pessoa => prm_pessoa.estado)
    pessoas!: Pessoa[];
}
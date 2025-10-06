import { Estado } from '@/dominios/estado/entidade/estado';
import { Pessoa } from '@/dominios/pessoa/entidade/entidade';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('municipio')
export class Municipio {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id_municipio' })
    id_municipio!: number;

    @Column({ type: 'int', name: 'nr_codigo_ibge' })
    nr_codigo_ibge!: number;

    @Column({ type: 'varchar', name: 'ds_municipio_tom', length: 50 })
    ds_municipio_tom!: string;

    @Column({ type: 'varchar', name: 'ds_municipio_ibge', length: 50 })
    ds_municipio_ibge!: string;

    @Column({ type: 'char', length: 2, name: 'ds_estado_abreviado' })
    ds_estado_abreviado!: string;

    @Column({ type: 'varchar', name: 'latitude', length: 20, nullable: true })
    latitude!: string;

    @Column({ type: 'varchar', name: 'longitude', length: 20, nullable: true })
    longitude!: string;

    @ManyToOne(() => Estado, { eager: true })
    @JoinColumn({ name: 'ds_estado_abreviado', referencedColumnName: 'ds_estado_abreviado' })
    estado!: Estado;

    @OneToMany(() => Pessoa, prm_pessoa => prm_pessoa.municipio)
    pessoas!: Pessoa[];
}
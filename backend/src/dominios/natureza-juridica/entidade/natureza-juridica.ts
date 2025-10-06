import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('natureza_juridica')
export class NaturezaJuridica {
    @PrimaryGeneratedColumn('increment')
    id_natureza_juridica!: number;

    @Column({ type: 'varchar', length: 8, nullable: false })
    ds_descricao!: string;
}
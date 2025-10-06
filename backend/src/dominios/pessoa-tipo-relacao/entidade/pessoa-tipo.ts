import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PessoaTipoRelacao } from './pessoa-tipo-relacao';

export enum TipoPessoa {
    FORNECEDOR = 'fornecedor',
    CLIENTE = 'cliente',
    EMBARCADOR = 'embarcador',
    TRANSPORTADORA = 'transportadora'
}

@Entity('pessoa_tipo')
export class PessoaTipo {
    @PrimaryGeneratedColumn('increment')
    id_pessoa_tipo!: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    ds_descricao!: string;

    @OneToMany(() => PessoaTipoRelacao, prm_relacao => prm_relacao.pessoa_tipo)
    pessoa_tipo_relacoes!: PessoaTipoRelacao[];

    constructor(prm_ds_descricao?: string) {
        if (prm_ds_descricao) {
            this.ds_descricao = prm_ds_descricao;
        }
    }

    /**
     * Atualiza a descrição do tipo de pessoa
     */
    public atualizarDescricao(prm_nova_descricao: string): void {
        this.ds_descricao = prm_nova_descricao;
    }

    /**
     * Verifica se é fornecedor
     */
    public ehFornecedor(): boolean {
        return this.ds_descricao?.toLowerCase() === TipoPessoa.FORNECEDOR;
    }

    /**
     * Verifica se é cliente
     */
    public ehCliente(): boolean {
        return this.ds_descricao?.toLowerCase() === TipoPessoa.CLIENTE;
    }

    /**
     * Verifica se é embarcador
     */
    public ehEmbarcador(): boolean {
        return this.ds_descricao?.toLowerCase() === TipoPessoa.EMBARCADOR;
    }

    /**
     * Verifica se é transportadora
     */
    public ehTransportadora(): boolean {
        return this.ds_descricao?.toLowerCase() === TipoPessoa.TRANSPORTADORA;
    }
}
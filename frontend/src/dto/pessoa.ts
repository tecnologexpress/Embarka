export interface IPessoaDTO {
    ds_documento: string;
    ds_descricao: string;
    ds_tratamento?: string;
    dt_origem: Date;
    ds_email: string;
    ds_telefone: string;
    ds_celular?: string;
    ds_pais: string;
    ds_estado: string;
    nr_codigo_ibge: number;
    ds_bairro: string;
    ds_cep: string;
    ds_endereco: string;
    ds_endereco_numero: string;
    ds_complemento?: string;
    ds_site?: string;
    ds_instagram?: string;
    ds_linkedin?: string;
    ds_twitter?: string;
    ds_facebook?: string;
    ds_inscricao_estadual?: string;
}
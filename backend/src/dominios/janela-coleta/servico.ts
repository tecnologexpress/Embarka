import { JanelaColetaRepositorio } from "./repositorio";
import { HttpErro } from "@/infraestrutura/erros/http-error";
import { IAtualizarJanelaDeColetaDto, ICriarJanelaDeColeta } from "./dtos";
import { PessoaRepositorio } from "../pessoa/repositorio";
import { JanelaDeColetaFornecedor } from "./entidade/janela-de-coleta-fornecedor.entidade";
import { FornecedorRepositorio } from "@/dominios/fornecedor/repositorio";

export class JanelaColetaServico {
    constructor(
        private readonly janelaColetaRepositorio = new JanelaColetaRepositorio(),
        private readonly pessoaRepositorio = new PessoaRepositorio(),
        private readonly fornecedorRepositorio = new FornecedorRepositorio()
    ) { }

    /**
     * Cria janela de coleta para o fornecedor vinculado à pessoa autenticada.
     * O id_fornecedor é inferido a partir do id_pessoa do token.
     */
    async criarJanelaDeColeta(prm_id_pessoa: number, prm_data: ICriarJanelaDeColeta) {
        const PESSOA = await this.pessoaRepositorio.obterPessoaPorId(prm_id_pessoa);
        if (!PESSOA) {
            throw new HttpErro(404, "Pessoa não encontrada.");
        }

        const FORNECEDOR = await this.fornecedorRepositorio.obterFornecedorPorIdPessoa(prm_id_pessoa);
        if (!FORNECEDOR) {
            throw new HttpErro(403, "Cadastro de pessoa não possui relação com fornecedor vinculado.");
        }

        const ENT = await this.janelaColetaRepositorio.criarJanelaDeColeta({
            id_fornecedor: FORNECEDOR.id_fornecedor,
            ds_dia_da_semana: prm_data.ds_dia_da_semana.toUpperCase(),
            hr_horario_inicio: prm_data.hr_horario_inicio,
            hr_horario_fim: prm_data.hr_horario_fim,
            hr_horario_intervalo_inicio: prm_data.hr_intervalo_inicio ?? null,
            hr_horario_intervalo_fim: prm_data.hr_intervalo_fim ?? null,
        });

        return this.janelaColetaRepositorio.salvarJanelaDeColeta(ENT);
    }

    async atualizarJanelaDeColeta(prm_data: IAtualizarJanelaDeColetaDto) {
        const EXISTE = await this.janelaColetaRepositorio.obterJanelaDeColetaPorId(prm_data.id_janela_de_coleta);
        if (!EXISTE) {
            throw new HttpErro(404, "Janela de coleta de fornecedor não encontrada.");
        }

        // normalizações simples
        const PATCH: Partial<JanelaDeColetaFornecedor> = { ...prm_data };
        if (PATCH.ds_dia_da_semana) {
            PATCH.ds_dia_da_semana = PATCH.ds_dia_da_semana.toUpperCase();
        }

        return this.janelaColetaRepositorio.atualizarJanelaDeColeta(prm_data.id_janela_de_coleta, PATCH);
    }

    async removerJanelaDeColeta(prm_id: number) {
        const EXISTE = await this.janelaColetaRepositorio.obterJanelaDeColetaPorId(prm_id);
        if (!EXISTE) {
            throw new HttpErro(404, "Janela de coleta de fornecedor não encontrada.");
        }
        await this.janelaColetaRepositorio.removerJanelaDeColeta(prm_id);
    }

    async listarJanelas(
        prm_filtros: { dia_da_semana?: string; id_fornecedor?: number },
    ) {
        // normaliza filtro de dia
        const FILTROS: { dia_da_semana?: string; id_fornecedor?: number } = {
            ...prm_filtros,
        };
        if (prm_filtros.dia_da_semana) {
            FILTROS.dia_da_semana = prm_filtros.dia_da_semana.toUpperCase();
        } else {
            delete FILTROS.dia_da_semana;
        }
        return this.janelaColetaRepositorio.listarJanelas(FILTROS);
    }
}

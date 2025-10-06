/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import listarEstados from "../services/estado/listar-estados";
import listarMunicipios from "../services/municipio/listar-municipios";

// Um tipo genérico para as opções do select, para evitar repetição
export interface OptionType {
    value: string | number;
    label: string;
}

/**
 * Hook para gerenciar a lógica de carregamento de UFs e Municípios.
 * @param prm_estado_selecionado - A sigla da UF (ex: "SP") que está atualmente selecionada no formulário.
 * O hook reagirá a mudanças neste valor para buscar os municípios correspondentes.
 */
/**
 * Hook para gerenciar a seleção de localização (UFs e municípios) em formulários.
 *
 * Este hook provê listas de UFs e municípios, além de estados de carregamento,
 * facilitando a integração com selects dinâmicos em formulários.
 *
 * @param prm_estado_selecionado - (Opcional) Sigla da UF selecionada. Quando alterada, dispara a busca dos municípios correspondentes.
 * 
 * @returns Um objeto contendo:
 * - `ufs`: Lista de opções de UFs formatadas para uso em selects ({ value, label }).
 * - `municipios`: Lista de opções de municípios da UF selecionada ({ value, label }).
 * - `carregandoUfs`: Indica se a lista de UFs está sendo carregada.
 * - `carregandoMunicipios`: Indica se a lista de municípios está sendo carregada.
 *
 * Funcionalidades:
 * - Carrega automaticamente as UFs ao montar o hook.
 * - Reage à mudança da UF selecionada, buscando os municípios correspondentes.
 * - Trata erros de carregamento exibindo notificações via toast.
 */
export const useLocalizacao = (prm_estado_selecionado?: string) => {
    const [estados, setEstados] = useState<OptionType[]>([]);
    const [municipios, setMunicipios] = useState<OptionType[]>([]);

    const [carregandoEstados, setCarregandoEstados] = useState(false);
    const [carregandoMunicipios, setCarregandoMunicipios] = useState(false);

    // Função para carregar as UFs, envolvida em useCallback para estabilidade
    const carregarEstados = useCallback(async () => {
        setCarregandoEstados(true);
        try {
            const { resultados } = await listarEstados({ pagina_atual: 1, itens_por_pagina: 1000 });
            const estadosFormatados = resultados.map((estado: any) => ({
                value: estado.ds_estado_abreviado,
                label: estado.ds_estado,
            }));
            setEstados(estadosFormatados);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Erro ao carregar lista de UFs");
        } finally {
            setCarregandoEstados(false);
        }
    }, []);

    // Função para carregar os municípios de uma estado específica
    const carregarMunicipios = useCallback(async (estado: string) => {
        if (!estado) {
            setMunicipios([]);
            return;
        }

        setCarregandoMunicipios(true);
        try {
            const { resultados } = await listarMunicipios({
                filtroEstadoAbreviado: estado,
                itens_por_pagina: 1000,
            });
            const municipiosFormatados = resultados.map((m: any) => ({
                value: m.nr_codigo_ibge,
                label: m.ds_municipio_ibge,
            }));
            setMunicipios(municipiosFormatados);
        } catch (error) {
            console.error("Erro ao carregar municípios", error);
            toast.error("Erro ao carregar a lista de municípios.");
            setMunicipios([]);
        } finally {
            setCarregandoMunicipios(false);
        }
    }, []);

    // Efeito para carregar as UFs uma única vez, quando o hook é montado
    useEffect(() => {
        carregarEstados();
    }, [carregarEstados]);

    // Efeito que REAGE à mudança da prm_estado_selecionado
    // Atende aos dois casos:
    // 1. Usuário seleciona uma UF no select -> prm_estado_selecionado muda -> busca municípios.
    // 2. Dados de uma pessoa são carregados no formulário ->
    // prm_estado_selecionado já vem com valor -> busca município cadastrado.
    useEffect(() => {
        carregarMunicipios(prm_estado_selecionado || "");
    }, [prm_estado_selecionado, carregarMunicipios]);

    return {
        estados,
        municipios,
        carregandoEstados,
        carregandoMunicipios,
    };
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { consultarCep } from "../services/consulta-cep";
import { consultarCNPJ } from "../services/consulta-cnpj";
import { validarCNPJ } from "../utils/validar-documento";
import { toast } from "react-toastify";

export interface OpcoesMudancaUniversal<TFormulario> {
    // comportamento por campo (opcional)
    camposSomenteDigitos?: Array<keyof TFormulario>;
    camposSomenteAlfanumericos?: Array<keyof TFormulario>;
    camposMaiusculos?: Array<keyof TFormulario>;
    camposNumericos?: Array<keyof TFormulario>;
    camposData?: Array<keyof TFormulario>;

    // se não informar, usamos os nomes padrão do seu DTO
    campoCep?: keyof TFormulario;            // default: "ds_cep"
    campoUf?: keyof TFormulario;             // default: "ds_estado"
    campoMunicipioIbge?: keyof TFormulario;  // default: "nr_codigo_ibge"
    campoDocumento?: keyof TFormulario;      // default: "ds_documento"

    // campos a ignorar (ex.: senha/confirmarSenha)
    nomesCamposIgnorados?: string[];

    // callback pós alteração (opcional)
    aposMudanca?: (proximo: TFormulario, nomeCampo: string, valor: any) => void;
}

// helpers
const somenteDigitos = (s: string) => s.replace(/\D+/g, "");
const somenteAlfanumericoMaiusculo = (s: string) =>
    s.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

function normalizarPorRegras<T>(
    chave: keyof T,
    valor: any,
    opcoes: Required<Pick<
        OpcoesMudancaUniversal<T>,
        "camposSomenteAlfanumericos" | "camposSomenteDigitos" | "camposMaiusculos" | "camposNumericos" | "camposData"
    >>
) {
    const {
        camposSomenteAlfanumericos,
        camposSomenteDigitos,
        camposMaiusculos,
        camposNumericos,
        camposData,
    } = opcoes;

    let v: any = valor;

    if (camposSomenteAlfanumericos.includes(chave)) {
        v = somenteAlfanumericoMaiusculo(String(v ?? ""));
    } else if (camposSomenteDigitos.includes(chave)) {
        v = somenteDigitos(String(v ?? ""));
    }

    if (camposMaiusculos.includes(chave)) v = String(v ?? "").toUpperCase();
    if (camposNumericos.includes(chave)) v = v === "" || v == null ? 0 : Number(v);
    if (camposData.includes(chave)) v = v ? new Date(v) : new Date();

    return v;
}

export function useMudancaFormularioUniversal<TFormulario extends Record<string, any>>(
    formulario: TFormulario,
    setFormulario: (atualizador: (anterior: TFormulario) => TFormulario) => void,
    opcoes?: OpcoesMudancaUniversal<TFormulario>
) {
    // defaults seguros (nomes padrão do seu DTO + nenhum comportamento obrigatório)
    const defaults = {
        camposSomenteDigitos: [] as Array<keyof TFormulario>,
        camposSomenteAlfanumericos: [] as Array<keyof TFormulario>,
        camposMaiusculos: [] as Array<keyof TFormulario>,
        camposNumericos: [] as Array<keyof TFormulario>,
        camposData: [] as Array<keyof TFormulario>,
        campoCep: "ds_cep" as keyof TFormulario,
        campoUf: "ds_estado" as keyof TFormulario,
        campoMunicipioIbge: "nr_codigo_ibge" as keyof TFormulario,
        campoDocumento: "ds_documento" as keyof TFormulario,
        nomesCamposIgnorados: [] as string[],
        aposMudanca: undefined as ((p: TFormulario, n: string, v: any) => void) | undefined,
    };

    const cfg = { ...defaults, ...(opcoes || {}) };

    const aoMudar = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const nomeCampo = (e.target.name || "") as keyof TFormulario | string;
            const valorBruto = e.target.value;

            if (cfg.nomesCamposIgnorados.includes(String(nomeCampo))) return;

            // 1) normalização base conforme regras de campo
            const VALOR_NORMALIZADO = normalizarPorRegras(
                nomeCampo as keyof TFormulario,
                valorBruto,
                {
                    camposSomenteAlfanumericos: cfg.camposSomenteAlfanumericos,
                    camposSomenteDigitos: cfg.camposSomenteDigitos,
                    camposMaiusculos: cfg.camposMaiusculos,
                    camposNumericos: cfg.camposNumericos,
                    camposData: cfg.camposData,
                }
            );

            // 2) efeitos especiais

            // 2.1 CEP -> autopreenche quando tiver 8 dígitos
            if (nomeCampo === cfg.campoCep) {
                const cep = somenteDigitos(String(valorBruto));
                if (cep.length === 8) {
                    try {
                        const dados = await consultarCep(cep);
                        setFormulario((anterior) => {
                            const proximo = { ...anterior } as any;
                            proximo[String(cfg.campoCep)] = cep;

                            if ("ds_endereco" in proximo) proximo.ds_endereco = dados.logradouro || "";
                            if ("ds_bairro" in proximo) proximo.ds_bairro = dados.bairro || "";
                            proximo[String(cfg.campoUf)] = String(dados.uf || "").toUpperCase();
                            proximo[String(cfg.campoMunicipioIbge)] = Number(dados.ibge) || 0;

                            cfg.aposMudanca?.(proximo, String(nomeCampo), cep);
                            return proximo;
                        });
                    } catch {
                        setFormulario((anterior) => {
                            const proximo = { ...anterior } as any;
                            proximo[String(cfg.campoCep)] = cep;
                            if ("ds_endereco" in proximo) proximo.ds_endereco = "";
                            if ("ds_bairro" in proximo) proximo.ds_bairro = "";
                            proximo[String(cfg.campoUf)] = "";
                            proximo[String(cfg.campoMunicipioIbge)] = 0;

                            cfg.aposMudanca?.(proximo, String(nomeCampo), cep);
                            return proximo;
                        });
                    }
                } else {
                    setFormulario((anterior) => {
                        const proximo = { ...anterior } as any;
                        proximo[String(cfg.campoCep)] = cep;
                        if ("ds_endereco" in proximo) proximo.ds_endereco = "";
                        if ("ds_bairro" in proximo) proximo.ds_bairro = "";
                        proximo[String(cfg.campoUf)] = "";
                        proximo[String(cfg.campoMunicipioIbge)] = 0;

                        cfg.aposMudanca?.(proximo, String(nomeCampo), cep);
                        return proximo;
                    });
                }
                return; // já tratou CEP
            }

            // 2.2 UF -> zera município ao trocar
            if (nomeCampo === cfg.campoUf) {
                setFormulario((anterior) => {
                    const proximo = { ...anterior } as any;
                    proximo[String(cfg.campoUf)] = String(VALOR_NORMALIZADO).toUpperCase();
                    proximo[String(cfg.campoMunicipioIbge)] = 0;
                    cfg.aposMudanca?.(proximo, String(nomeCampo), proximo[String(cfg.campoUf)]);
                    return proximo;
                });
                return;
            }

            // 2.3 Município IBGE -> força número
            if (nomeCampo === cfg.campoMunicipioIbge) {
                setFormulario((anterior) => {
                    const proximo = { ...anterior } as any;
                    proximo[String(cfg.campoMunicipioIbge)] = Number(VALOR_NORMALIZADO) || 0;
                    cfg.aposMudanca?.(proximo, String(nomeCampo), proximo[String(cfg.campoMunicipioIbge)]);
                    return proximo;
                });
                return;
            }

            // 2.4 Documento (CNPJ 2026): alfanumérico maiúsculo + autocomplete ao completar 14
            if (nomeCampo === cfg.campoDocumento) {
                const doc = somenteAlfanumericoMaiusculo(String(valorBruto));
                setFormulario((anterior) => {
                    const proximo = { ...anterior } as any;
                    proximo[String(cfg.campoDocumento)] = doc;
                    cfg.aposMudanca?.(proximo, String(nomeCampo), doc);
                    return proximo;
                });

                // tamanho padrão fixo: 14
                if (doc.length === 14) {
                    try {
                        const CNPJ_VALIDO = await validarCNPJ(doc);
                        if (!CNPJ_VALIDO) {
                            toast.error("CNPJ inválido. Verifique e tente novamente.");
                        }

                        const bruto = await consultarCNPJ(doc);
                        if (bruto && typeof bruto === "object") {
                            // map/merge com normalização
                            setFormulario((anterior) => {
                                const proximo = { ...anterior } as any;

                                // mapeamento comum retornado por serviços de CNPJ
                                const mapeado: Record<string, any> = {
                                    ds_documento: doc,
                                    ds_descricao: bruto.razao_social ?? proximo.ds_descricao,
                                    ds_tratamento: bruto.nome_fantasia ?? proximo.ds_tratamento,
                                    ds_estado: (bruto.uf ?? proximo.ds_estado ?? "").toUpperCase(),
                                    nr_codigo_ibge: Number(
                                        bruto.codigo_municipio_ibge ?? proximo.nr_codigo_ibge ?? 0
                                    ),
                                    ds_cep: somenteDigitos(bruto.cep ?? proximo.ds_cep ?? ""),
                                    ds_bairro: bruto.bairro ?? proximo.ds_bairro,
                                    ds_endereco: bruto.descricao_tipo_de_logradouro && bruto.logradouro
                                        ? `${bruto.descricao_tipo_de_logradouro} ${bruto.logradouro}`
                                        : (proximo.ds_endereco || ""),
                                    ds_endereco_numero: bruto.numero ?? proximo.ds_endereco_numero,
                                    ds_telefone: somenteDigitos(
                                        bruto.ddd_telefone_1 || bruto.ddd_telefone_2 || proximo.ds_telefone || ""
                                    ),
                                    ds_email: bruto.email ?? proximo.ds_email,
                                    ds_pais: bruto.pais ?? proximo.ds_pais ?? "Brasil",
                                    ds_complemento: bruto.complemento ?? proximo.ds_complemento,
                                    dt_origem: bruto.data_inicio_atividade
                                        ? new Date(bruto.data_inicio_atividade)
                                        : proximo.dt_origem,
                                };

                                // aplica normalização declarativa, quando aplicável
                                (Object.keys(mapeado) as Array<keyof TFormulario>).forEach((chave) => {
                                    if (chave in proximo) {
                                        proximo[chave as string] = normalizarPorRegras(
                                            chave,
                                            mapeado[chave as string],
                                            {
                                                camposSomenteAlfanumericos: cfg.camposSomenteAlfanumericos,
                                                camposSomenteDigitos: cfg.camposSomenteDigitos,
                                                camposMaiusculos: cfg.camposMaiusculos,
                                                camposNumericos: cfg.camposNumericos,
                                                camposData: cfg.camposData,
                                            }
                                        );
                                    }
                                });

                                cfg.aposMudanca?.(proximo, String(nomeCampo), doc);
                                return proximo;
                            });
                        }
                    } catch {
                        // silencioso: se a API falhar, não interrompe a digitação
                    }
                }
                return;
            }

            // 3) atualização padrão do campo
            setFormulario((anterior) => {
                const proximo = { ...anterior, [nomeCampo as string]: VALOR_NORMALIZADO };
                cfg.aposMudanca?.(proximo, String(nomeCampo), VALOR_NORMALIZADO);
                return proximo;
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cfg, setFormulario]
    );

    return { aoMudar };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCcw, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import deletarJanelaDeColetaFornecedor from "../../../services/fornecedor/janela-de-coleta/deletar-janela";
import listarJanelaDeColetaFornecedor from "../../../services/fornecedor/janela-de-coleta/listar-janelas";
import { mensagemDeErro } from "../../../utils/mensagem-erro";
import type { IJanelaDeColetaFornecedorDto } from "../../../dto/fornecedor/janela-de-coleta";
import {
  DIAS_DA_SEMANA,
  type TDiasDaSemana,
} from "../../../tipos/dias-da-semana";
import { ModalCriarJanelaDeColeta } from "./modal/ModalCriarJanelaDeColeta";
import { ModalEditarJanelaDeColeta } from "./modal/ModalEditarJanelaDeColeta";
import TabelaGenerica, {
  type IColunaTabela,
} from "../../../components/templates/TabelaDeDadosTemplate";

const JanelaDeColeta = () => {
  const [itens, setItens] = useState<IJanelaDeColetaFornecedorDto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modo, setModo] = useState<"criar" | "editar">("criar");
  const [editando, setEditando] = useState<IJanelaDeColetaFornecedorDto | null>(
    null
  );

  const diasEmUso = useMemo(
    () => itens.map((i) => i.ds_dia_da_semana as TDiasDaSemana),
    [itens]
  );

  const fecharModal = useCallback(() => setModalAberto(false), []);

  const carregarLista = useCallback(async () => {
    try {
      // setCarregando(true);
      const resultados = await listarJanelaDeColetaFornecedor({});

      const dados = Array.isArray(resultados)
        ? resultados
        : Array.isArray(resultados)
        ? resultados
        : resultados?.data ?? [];
      setItens(dados as IJanelaDeColetaFornecedorDto[]);
    } catch (e: any) {
      toast.error(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarLista();
  }, [modalAberto, carregarLista]);

  const abrirModalCriar = useCallback(() => {
    setModo("criar");
    setEditando(null);
    setModalAberto(true);
  }, []);

  const abrirModalEditar = useCallback((item: IJanelaDeColetaFornecedorDto) => {
    setModo("editar");
    setEditando(item);
    setModalAberto(true);
  }, []);

  const handleExclusao = useCallback(
    async (id: number) => {
      if (!confirm("Deseja realmente remover esta janela de coleta?")) return;
      try {
        await deletarJanelaDeColetaFornecedor(id);
        toast.success("Janela removida com sucesso!");
        await carregarLista();
      } catch (e: any) {
        toast.error(mensagemDeErro(e));
      }
    },
    [carregarLista]
  );

  const COLUNAS: IColunaTabela<IJanelaDeColetaFornecedorDto>[] = [
    {
      key: "ds_dia_da_semana",
      label: "Dia",
      width: "w-[150px]",
      formatador: (valor) => {
        const diaEncontrado = DIAS_DA_SEMANA.find(
          (d) => d.value === (valor as TDiasDaSemana)
        );
        return (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {diaEncontrado?.label ?? (valor as string)}
          </span>
        );
      },
    },
    {
      key: "hr_horario_inicio",
      label: "Janela de Coleta",
      renderizador: (item) =>
        `${item.hr_horario_inicio} — ${item.hr_horario_fim}`,
    },
    {
      key: "hr_horario_intervalo_inicio",
      label: "Intervalo",
      renderizador: (item) =>
        item.hr_horario_intervalo_inicio && item.hr_horario_intervalo_fim ? (
          `${item.hr_horario_intervalo_inicio} — ${item.hr_horario_intervalo_fim}`
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "acoes", // Chave para a coluna de Ações
      label: "Ações",
      width: "w-[120px]",
      // Implementa o renderizador para os botões de Ação
      renderizador: (item) => (
        <div className="flex items-center justify-center gap-2 m-auto">
          <button
            onClick={() => abrirModalEditar(item)}
            className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleExclusao(item.id_janela_de_coleta_fornecedor)}
            className="rounded-lg border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50"
            aria-label="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Minha Janela de Coleta
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={carregarLista}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </button>
          <button
            onClick={abrirModalCriar}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white shadow hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            Nova janela
          </button>
        </div>
      </div>

      <TabelaGenerica<IJanelaDeColetaFornecedorDto>
        dados={itens}
        colunas={COLUNAS}
        carregando={carregando}
        tituloMensagemVazia="Nenhuma janela de coleta cadastrada."
        tituloDescricaoVazia="Crie uma nova janela para que possamos organizar as coletas dos seus pedidos."
        rotuloAcaoMensagemVazia="Criar janela"
        iconeDadosVazios={<Calendar className="h-16 w-16 text-gray-300" />}
        aoAcionarBotaoMensagemVazio={abrirModalCriar}
      />

      {/* Renderização condicional dos modais */}
      {modalAberto && modo === "criar" && (
        <ModalCriarJanelaDeColeta
          abrir={modalAberto}
          aoFechar={fecharModal}
          diasEmUso={diasEmUso}
        />
      )}

      {modalAberto && modo === "editar" && editando && (
        <ModalEditarJanelaDeColeta
          abrir={modalAberto}
          aoFechar={fecharModal}
          diasEmUso={diasEmUso}
          item={editando}
        />
      )}
    </div>
  );
};

export default JanelaDeColeta;

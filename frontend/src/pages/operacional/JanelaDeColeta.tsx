// src/pages/Operacional/JanelaDeColeta.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCcw,
  CalendarDays,
  Clock,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import atualizarJanelaDeColetaFornecedor from "../../services/fornecedor/janela-de-coleta/atualizar-janela";
import criarJanelaDeColetaFornecedor from "../../services/fornecedor/janela-de-coleta/criar-janela";
import deletarJanelaDeColetaFornecedor from "../../services/fornecedor/janela-de-coleta/deletar-janela";
import listarJanelaDeColetaFornecedor from "../../services/fornecedor/janela-de-coleta/listar-janelas";
import { mensagemDeErro } from "../../utils/mensagem-erro";

// -------------------- Tipos (espelham seus DTOs) --------------------
import type {
  ICriarJanelaDeColeta,
  IAtualizarJanelaDeColetaDto,
} from "../../dto/fornecedor/janela-de-coleta";

// Defina o tipo DiaSemana localmente, já que não está exportado pelo DTO
type DiaSemana =
  | "SEGUNDA"
  | "TERCA"
  | "QUARTA"
  | "QUINTA"
  | "SEXTA"
  | "SABADO"
  | "DOMINGO";

// O ITEM que vem da API na listagem:
type JanelaItem = {
  id_janela_de_coleta: number;
  ds_dia_da_semana: DiaSemana;
  hr_horario_inicio: string;
  hr_horario_fim: string;
  hr_intervalo_inicio?: string;
  hr_intervalo_fim?: string;
};

// -------------------- Helpers --------------------
const HORA_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // HH:mm
const DIAS: { value: DiaSemana; label: string }[] = [
  { value: "SEGUNDA", label: "Segunda" },
  { value: "TERCA", label: "Terça" },
  { value: "QUARTA", label: "Quarta" },
  { value: "QUINTA", label: "Quinta" },
  { value: "SEXTA", label: "Sexta" },
  { value: "SABADO", label: "Sábado" },
  { value: "DOMINGO", label: "Domingo" },
];

const toSec = (hhmm?: string) => {
  if (!hhmm || !HORA_REGEX.test(hhmm)) return NaN;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
};

const validatePayload = (p: ICriarJanelaDeColeta) => {
  if (!p.ds_dia_da_semana) throw new Error("Selecione um dia da semana.");
  if (!HORA_REGEX.test(p.hr_horario_inicio))
    throw new Error("Horário inicial inválido.");
  if (!HORA_REGEX.test(p.hr_horario_fim))
    throw new Error("Horário final inválido.");

  const wi = toSec(p.hr_horario_inicio);
  const wf = toSec(p.hr_horario_fim);
  if (!(wi < wf))
    throw new Error("O horário inicial deve ser menor que o final.");

  const hasIv = Boolean(p.hr_intervalo_inicio || p.hr_intervalo_fim);
  if (hasIv) {
    if (!HORA_REGEX.test(p.hr_intervalo_inicio || "")) {
      throw new Error("Início do intervalo inválido.");
    }
    if (!HORA_REGEX.test(p.hr_intervalo_fim || "")) {
      throw new Error("Fim do intervalo inválido.");
    }
    const ii = toSec(p.hr_intervalo_inicio);
    const ifi = toSec(p.hr_intervalo_fim);
    if (!(ii < ifi))
      throw new Error("O início do intervalo deve ser menor que o fim.");
    if (!(wi < ii && ifi < wf))
      throw new Error(
        "O intervalo deve estar contido dentro da janela principal."
      );
  }
};

// -------------------- UI Components --------------------
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
    <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gray-400" />
    <h4 className="mb-1 text-lg font-semibold text-gray-800">
      Nenhuma janela de coleta cadastrada
    </h4>
    <p className="mb-6 text-sm text-gray-600">
      Cadastre os horários de coleta por dia da semana.
    </p>
    <button
      onClick={onCreate}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    >
      <Plus className="h-4 w-4" />
      Nova janela
    </button>
  </div>
);

// -------------------- Form --------------------
type FormMode = "create" | "edit";

const JanelaForm: React.FC<{
  mode: FormMode;
  inUseDays: DiaSemana[]; // para bloquear dias já usados (exceto o do próprio item no edit)
  initial?: Partial<JanelaItem>;
  onCancel: () => void;
  onSubmit: (
    payload: ICriarJanelaDeColeta | IAtualizarJanelaDeColetaDto
  ) => Promise<void>;
  submitting: boolean;
}> = ({ mode, inUseDays, initial, onCancel, onSubmit, submitting }) => {
  const [dia, setDia] = useState<DiaSemana>(
    (initial?.ds_dia_da_semana as DiaSemana) || "SEGUNDA"
  );
  const [hIni, setHIni] = useState(initial?.hr_horario_inicio || "");
  const [hFim, setHFim] = useState(initial?.hr_horario_fim || "");
  const [iIni, setIIni] = useState(initial?.hr_intervalo_inicio || "");
  const [iFim, setIFim] = useState(initial?.hr_intervalo_fim || "");

  const disabledDays = useMemo(() => {
    const set = new Set(inUseDays);
    // em edição, mantém o dia atual habilitado
    if (mode === "edit" && initial?.ds_dia_da_semana)
      set.delete(initial.ds_dia_da_semana as DiaSemana);
    return set;
  }, [inUseDays, initial?.ds_dia_da_semana, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const base: ICriarJanelaDeColeta = {
        ds_dia_da_semana: dia,
        hr_horario_inicio: hIni,
        hr_horario_fim: hFim,
        hr_intervalo_inicio: iIni || undefined,
        hr_intervalo_fim: iFim || undefined,
      };
      validatePayload(base);

      if (mode === "create") {
        await onSubmit(base);
      } else {
        await onSubmit({
          id_janela_de_coleta: Number(initial?.id_janela_de_coleta),
          ds_dia_da_semana: dia, // DiaSemana is always a string, never undefined
          hr_horario_inicio: hIni,
          hr_horario_fim: hFim,
          hr_intervalo_inicio: iIni || undefined,
          hr_intervalo_fim: iFim || undefined,
        } as IAtualizarJanelaDeColetaDto);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(mensagemDeErro(err));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Dia da semana
        </label>
        <select
          value={dia}
          onChange={(e) => setDia(e.target.value as DiaSemana)}
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {DIAS.map((d) => (
            <option
              key={d.value}
              value={d.value}
              disabled={disabledDays.has(d.value)}
            >
              {d.label} {disabledDays.has(d.value) ? "(já cadastrado)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Horário inicial
          </label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="time"
              value={hIni}
              onChange={(e) => setHIni(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Horário final
          </label>
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="time"
              value={hFim}
              onChange={(e) => setHFim(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Intervalo (início) — opcional
          </label>
          <input
            type="time"
            value={iIni}
            onChange={(e) => setIIni(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Intervalo (fim) — opcional
          </label>
          <input
            type="time"
            value={iFim}
            onChange={(e) => setIFim(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// -------------------- Página --------------------
const JanelaDeColeta: React.FC = () => {
  const [itens, setItens] = useState<JanelaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("create");
  const [editing, setEditing] = useState<JanelaItem | null>(null);

  const diasEmUso = useMemo(
    () => itens.map((i) => i.ds_dia_da_semana),
    [itens]
  );

  const load = async () => {
    try {
      setLoading(true);
      const resp = await listarJanelaDeColetaFornecedor({});
      // backend pode retornar { registros, total... } ou array simples; normalizamos
      const dados = Array.isArray(resp?.registros)
        ? resp.registros
        : Array.isArray(resp)
        ? resp
        : resp?.data ?? [];
      setItens(dados as JanelaItem[]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (prm_e: any) {
      toast.error(mensagemDeErro(prm_e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = () => {
    setMode("create");
    setEditing(null);
    setModalOpen(true);
  };

  const onEdit = (row: JanelaItem) => {
    setMode("edit");
    setEditing(row);
    setModalOpen(true);
  };

  const submitForm = async (
    payload: ICriarJanelaDeColeta | IAtualizarJanelaDeColetaDto
  ) => {
    try {
      setUpdating(true);

      if ("id_janela_de_coleta" in payload) {
        // EDITAR
        await atualizarJanelaDeColetaFornecedor({ dados: payload });
        toast.success("Janela atualizada.");
      } else {
        // CRIAR
        await criarJanelaDeColetaFornecedor({ dados: payload });
        toast.success("Janela criada.");
      }

      setModalOpen(false);
      await load();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (prm_e: any) {
      toast.error(mensagemDeErro(prm_e));
    } finally {
      setUpdating(false);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Deseja remover esta janela de coleta?")) return;
    try {
      await deletarJanelaDeColetaFornecedor(id);
      toast.success("Janela removida.");
      await load();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (prm_e: any) {
      toast.error(mensagemDeErro(prm_e));
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          Janela de Coleta
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Atualizar
          </button>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white shadow hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            Nova janela
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-medium text-gray-700">
            Configure uma janela por dia da semana.
          </p>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Carregando...
            </div>
          ) : itens.length === 0 ? (
            <EmptyState onCreate={onCreate} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600">
                    <th className="px-4 py-3 font-semibold">Dia</th>
                    <th className="px-4 py-3 font-semibold">Janela</th>
                    <th className="px-4 py-3 font-semibold">Intervalo</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itens
                    .slice()
                    .sort(
                      (a, b) =>
                        DIAS.findIndex((d) => d.value === a.ds_dia_da_semana) -
                        DIAS.findIndex((d) => d.value === b.ds_dia_da_semana)
                    )
                    .map((row) => (
                      <tr key={row.id_janela_de_coleta} className="border-t">
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            {DIAS.find((d) => d.value === row.ds_dia_da_semana)
                              ?.label ?? row.ds_dia_da_semana}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {row.hr_horario_inicio} — {row.hr_horario_fim}
                        </td>
                        <td className="px-4 py-3">
                          {row.hr_intervalo_inicio && row.hr_intervalo_fim ? (
                            `${row.hr_intervalo_inicio} — ${row.hr_intervalo_fim}`
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onEdit(row)}
                              className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50"
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDelete(row.id_janela_de_coleta)}
                              className="rounded-lg border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50"
                              aria-label="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal criar/editar */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          mode === "create"
            ? "Nova janela de coleta"
            : "Editar janela de coleta"
        }
      >
        <JanelaForm
          mode={mode}
          initial={editing ?? undefined}
          inUseDays={diasEmUso as DiaSemana[]}
          onCancel={() => setModalOpen(false)}
          onSubmit={submitForm}
          submitting={updating}
        />
      </Modal>
    </div>
  );
};

export default JanelaDeColeta;

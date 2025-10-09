import React, { useState } from "react";
import { Clock, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import { mensagemDeErro } from "../../../../utils/mensagem-erro";
import {
  DIAS_DA_SEMANA,
  type TDiasDaSemana,
} from "../../../../tipos/dias-da-semana";
import { ModalBase } from "./ModalBase";
import type { ICriarJanelaDeColetaFornecedorDto } from "../../../../dto/fornecedor/janela-de-coleta";
import criarJanelaDeColetaFornecedor from "../../../../services/fornecedor/janela-de-coleta/criar-janela";

type ModalCriarProps = {
  abrir: boolean;
  aoFechar: () => void;
  diasEmUso: TDiasDaSemana[];
};

export const ModalCriarJanelaDeColeta: React.FC<ModalCriarProps> = ({
  abrir,
  aoFechar,
  diasEmUso,
}) => {
  const [enviando, setEnviando] = useState(false);
  const [formulario, setFormulario] =
    useState<ICriarJanelaDeColetaFornecedorDto>({
      ds_dia_da_semana: "SEGUNDA",
      hr_horario_inicio: "",
      hr_horario_fim: "",
      hr_horario_intervalo_inicio: "",
      hr_horario_intervalo_fim: "",
    });

  const DESATIVAR_DIAS = React.useMemo(() => {
    return new Set(diasEmUso);
  }, [diasEmUso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setEnviando(true);

      const payload: ICriarJanelaDeColetaFornecedorDto = {
        ds_dia_da_semana: formulario.ds_dia_da_semana,
        hr_horario_inicio: formulario.hr_horario_inicio,
        hr_horario_fim: formulario.hr_horario_fim,
      };

      // Adiciona os campos de intervalo somente se eles estiverem preenchidos
      if (
        formulario.hr_horario_intervalo_inicio &&
        formulario.hr_horario_intervalo_fim
      ) {
        payload.hr_horario_intervalo_inicio =
          formulario.hr_horario_intervalo_inicio;
        payload.hr_horario_intervalo_fim = formulario.hr_horario_intervalo_fim;
      }

      await criarJanelaDeColetaFornecedor(payload);
      toast.success("Janela criada com sucesso!");
      aoFechar();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ModalBase abrir={abrir} aoFechar={aoFechar} titulo="Nova janela de coleta">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Dia da semana
          </label>
          <select
            name="ds_dia_da_semana"
            value={formulario.ds_dia_da_semana}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {DIAS_DA_SEMANA.map((d) => (
              <option
                key={d.value}
                value={d.value}
                disabled={DESATIVAR_DIAS.has(d.value)}
              >
                {d.label} {DESATIVAR_DIAS.has(d.value) ? "(já cadastrado)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Campos de Horário */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Horário inicial
            </label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="time"
                name="hr_horario_inicio"
                value={formulario.hr_horario_inicio}
                onChange={handleChange}
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
                name="hr_horario_fim"
                value={formulario.hr_horario_fim}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-10 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Campos de Intervalo */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Intervalo (início) — opcional
            </label>
            <input
              type="time"
              name="hr_horario_intervalo_inicio"
              value={formulario.hr_horario_intervalo_inicio}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Intervalo (fim) — opcional
            </label>
            <input
              type="time"
              name="hr_horario_intervalo_fim"
              value={formulario.hr_horario_intervalo_fim}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={aoFechar}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {enviando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

import { Plus } from "lucide-react";
import React from "react";

interface IDadosVaziosProps {
  icone?: React.ReactNode;
  titulo: string;
  descricao?: string;
  rotuloAcao?: string;
  aoAcionar?: () => void;
}

const DadosVazios: React.FC<IDadosVaziosProps> = ({
  icone,
  titulo,
  descricao,
  rotuloAcao,
  aoAcionar,
}) => (
  <div className="w-full rounded-xl border border-dashed border-gray-300 p-10 text-center">
    {icone && (
      <div className="mx-auto h-10 w-10 text-gray-400 mb-8">
        {/* Ao chamar o ícone com o template, 
        tamanho do ícone recomendado size={44} */}
        {icone}
      </div>
    )}
    <h4 className="mb-1 text-lg font-semibold text-gray-800">{titulo}</h4>
    {descricao && <p className="mb-6 text-sm text-gray-600">{descricao}</p>}
    {rotuloAcao && aoAcionar && (
      <button
        onClick={aoAcionar}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <Plus className="h-4 w-4" />
        {rotuloAcao}
      </button>
    )}
  </div>
);

export default DadosVazios;

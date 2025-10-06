import React from "react";
import type { LucideIcon } from "lucide-react";

interface PropsBotao extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario" | "contorno" | "fantasma";
  tamanho?: "pequeno" | "medio" | "grande";
  icone?: LucideIcon;
  posicaoIcone?: "esquerda" | "direita";
  carregando?: boolean;
  larguraTotal?: boolean;
}

const Botao: React.FC<PropsBotao> = ({
  children,
  variante = "primario",
  tamanho = "medio",
  icone: Icone,
  posicaoIcone = "esquerda",
  carregando = false,
  larguraTotal = false,
  className = "",
  disabled,
  ...props
}) => {
  const classesBase =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const classesVariante = {
    primario:
      "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm",
    secundario:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm",
    contorno:
      "border border-green-500 text-green-600 hover:bg-green-50 focus:ring-green-500",
    fantasma: "text-green-600 hover:bg-green-50 focus:ring-green-500",
    
  };

  const classesTamanho = {
    pequeno: "px-3 py-1.5 text-sm",
    medio: "px-4 py-2.5 text-sm",
    grande: "px-6 py-3 text-base",
  };

  const estaDesabilitado = disabled || carregando;

  return (
    <button
      className={`
                ${classesBase}
                ${classesVariante[variante]}
                ${classesTamanho[tamanho]}
                ${larguraTotal ? "w-full" : ""}
                ${estaDesabilitado ? "opacity-50 cursor-not-allowed" : ""}
                ${className}
            `}
      disabled={estaDesabilitado}
      {...props}
    >
      {carregando ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      ) : (
        Icone &&
        posicaoIcone === "esquerda" && <Icone className="w-4 h-4 mr-2" />
      )}
      {children}
      {!carregando && Icone && posicaoIcone === "direita" && (
        <Icone className="w-4 h-4 ml-2" />
      )}
    </button>
  );
};

export default Botao;

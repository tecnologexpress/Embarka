import React from "react";
import { X } from "lucide-react";

type ModalBaseProps = {
  abrir: boolean;
  aoFechar: () => void;
  titulo: string;
  children: React.ReactNode;
};

export const ModalBase: React.FC<ModalBaseProps> = ({
  abrir,
  aoFechar,
  titulo,
  children,
}) => {
  if (!abrir) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={aoFechar}
        aria-hidden
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
          <button
            onClick={aoFechar}
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

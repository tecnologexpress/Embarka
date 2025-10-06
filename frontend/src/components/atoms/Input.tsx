import React, { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string;
  erro?: string;
  icone?: LucideIcon;
  textoAjuda?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { rotulo, erro, icone: Icone, textoAjuda, className = "", ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {rotulo && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {rotulo}
          </label>
        )}
        <div className="relative">
          {Icone && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icone className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`
                            w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                            transition-colors duration-200
                            ${Icone ? "pl-10" : ""}
                            ${
                              erro
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : ""
                            }
                            ${className}
                        `}
            {...props}
          />
        </div>
        {erro && <p className="mt-1 text-sm text-red-600">{erro}</p>}
        {textoAjuda && !erro && (
          <p className="mt-1 text-sm text-gray-500">{textoAjuda}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

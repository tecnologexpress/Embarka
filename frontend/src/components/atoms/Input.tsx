import React, { forwardRef, useMemo, useCallback } from "react";
import type { LucideIcon } from "lucide-react";

type TipoMascara =
  | "cnpj"
  | "cep"
  | "telefone"
  | "celular"
  | "telefoneOuCelular";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string;
  erro?: string;
  icone?: LucideIcon;
  textoAjuda?: string;
  divClassName?: string;

  /** Define a máscara visual + limpeza do valor */
  mascara?: TipoMascara;
}

/* =========================
   Helpers de limpeza/mascara
   ========================= */
const soDigitos = (s: string) => (s || "").replace(/\D+/g, "");
const soAlfanumericoMaiusculo = (s: string) =>
  (s || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

/** CNPJ (padrão 2026): 14 alfanuméricos, exibe 00.000.000/0000-00 */
function formatarCNPJ(alnum: string) {
  const s = soAlfanumericoMaiusculo(alnum).slice(0, 14);
  const b1 = s.slice(0, 2);
  const b2 = s.slice(2, 5);
  const b3 = s.slice(5, 8);
  const b4 = s.slice(8, 12);
  const b5 = s.slice(12, 14);
  let out = b1;
  if (b2) out += "." + b2;
  if (b3) out += "." + b3;
  if (b4) out += "/" + b4;
  if (b5) out += "-" + b5;
  return out;
}

/** Telefone fixo: (00) 0000-0000 (10 dígitos) */
function formatarTelefone10(d: string) {
  const s = soDigitos(d).slice(0, 10);
  const ddd = s.slice(0, 2);
  const p1 = s.slice(2, 6);
  const p2 = s.slice(6, 10);
  let out = ddd ? `(${ddd}` : "";
  if (ddd.length === 2) out += ") ";
  out += p1;
  if (p2) out += "-" + p2;
  return out;
}

/** Celular: (00) 00000-0000 (11 dígitos) */
function formatarTelefone11(d: string) {
  const s = soDigitos(d).slice(0, 11);
  const ddd = s.slice(0, 2);
  const p1 = s.slice(2, 7);
  const p2 = s.slice(7, 11);
  let out = ddd ? `(${ddd}` : "";
  if (ddd.length === 2) out += ") ";
  out += p1;
  if (p2) out += "-" + p2;
  return out;
}

/** Telefone genérico: decide entre 10 e 11 */
function formatarTelefone(d: string) {
  const s = soDigitos(d);
  return s.length > 10 ? formatarTelefone11(s) : formatarTelefone10(s);
}

/** CEP: 00000-000 (8 dígitos) */
function formatarCEP(d: string) {
  const s = soDigitos(d).slice(0, 8);
  const p1 = s.slice(0, 5);
  const p2 = s.slice(5, 8);
  return p2 ? `${p1}-${p2}` : p1;
}

/** Normaliza (valor limpo) de acordo com a máscara */
function limparPorMascara(valor: string, mascara?: TipoMascara) {
  if (!mascara) return valor;
  switch (mascara) {
    case "cnpj":
      return soAlfanumericoMaiusculo(valor).slice(0, 14);
    case "cep":
      return soDigitos(valor).slice(0, 8);
    case "telefone":
      return soDigitos(valor).slice(0, 10); // força 10
    case "celular":
      return soDigitos(valor).slice(0, 11); // força 11
    case "telefoneOuCelular":
      return soDigitos(valor).slice(0, 11); // até 11
    default:
      return valor;
  }
}

/** Formata para exibição conforme a máscara */
function formatarPorMascara(valorLimpo: string, mascara?: TipoMascara) {
  if (!mascara) return valorLimpo;
  switch (mascara) {
    case "cnpj":
      return formatarCNPJ(valorLimpo);
    case "cep":
      return formatarCEP(valorLimpo);
    case "telefone":
      return formatarTelefone10(valorLimpo);
    case "celular":
      return formatarTelefone11(valorLimpo);
    case "telefoneOuCelular":
      return formatarTelefone(valorLimpo);
    default:
      return valorLimpo;
  }
}

/** Define o maxLength visual ideal (com pontuação) */
function maxLengthPorMascara(mascara?: TipoMascara) {
  switch (mascara) {
    case "cnpj":
      return 18; // 00.000.000/0000-00
    case "cep":
      return 9; // 00000-000
    case "telefone":
      return 14; // (00) 0000-0000
    case "celular":
      return 15; // (00) 00000-0000
    case "telefoneOuCelular":
      return 15; // até 11 dígitos
    default:
      return undefined;
  }
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      rotulo,
      erro,
      icone: Icone,
      textoAjuda,
      divClassName,
      className = "",
      mascara,
      onChange,
      value,
      name,
      maxLength,
      ...props
    },
    ref
  ) => {
    // valor "limpo" vindo de fora (estado controlado)
    const valorLimpo = useMemo(() => {
      const v = typeof value === "number" ? String(value) : String(value ?? "");
      return limparPorMascara(v, mascara);
    }, [value, mascara]);

    // valor exibido (mascarado)
    const valorExibido = useMemo(() => {
      return formatarPorMascara(valorLimpo, mascara);
    }, [valorLimpo, mascara]);

    // maxLength visual sugerido pela máscara (pode ser sobrescrito via prop)
    const maxLen = useMemo(
      () => maxLengthPorMascara(mascara) ?? maxLength,
      [mascara, maxLength]
    );

    // ao digitar: formata para exibição e envia LIMPO para o onChange do pai
    const aoTrocar = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorDigitado = e.target.value ?? "";
        const limpo = limparPorMascara(valorDigitado, mascara);

        // monta um evento sintético passando o valor limpo
        if (onChange) {
          onChange({
            ...e,
            target: {
              ...e.target,
              name: name ?? e.target.name,
              value: limpo,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      },
      [onChange, mascara, name]
    );

    return (
      <div className={`w-full ${divClassName ?? ""}`}>
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
            name={name}
            value={valorExibido}
            onChange={mascara ? aoTrocar : onChange}
            maxLength={maxLen}
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

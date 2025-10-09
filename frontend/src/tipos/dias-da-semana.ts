export type TDiasDaSemana =
    | "SEGUNDA"
    | "TERCA"
    | "QUARTA"
    | "QUINTA"
    | "SEXTA"
    | "SABADO"
    | "DOMINGO";

export const DIAS_DA_SEMANA: { value: TDiasDaSemana; label: string }[] = [
    { value: "SEGUNDA", label: "Segunda-feira" },
    { value: "TERCA", label: "Terça-feira" },
    { value: "QUARTA", label: "Quarta-feira" },
    { value: "QUINTA", label: "Quinta-feira" },
    { value: "SEXTA", label: "Sexta-feira" },
    { value: "SABADO", label: "Sábado" },
    { value: "DOMINGO", label: "Domingo" },
];

import { Loader2 } from "lucide-react";
import React from "react";

type SpinnerCarregamentoProps = {
  size?: number;
  color?: string;
  className?: string;
};

const SpinnerCarregamento: React.FC<SpinnerCarregamentoProps> = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => (
  <Loader2
    className={`animate-spin ${className}`}
    size={size}
    color={color}
    aria-label="Carregando"
    role="status"
  />
);

export default SpinnerCarregamento;

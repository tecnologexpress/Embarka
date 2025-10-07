
import React, { useState, useRef, useEffect } from "react";
import { Shield, Mail, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import Botao from "../atoms/Botao";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface FormularioValidacao2FAProps {
  email?: string;
  onValidacao?: (codigo: string) => Promise<void>;
  onReenvio?: () => Promise<void>;
}

const FormularioValidacao2FA: React.FC<FormularioValidacao2FAProps> = ({
  email = "usuario@exemplo.com",
  onValidacao,
  onReenvio,
}) => {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [reenvioLoading, setReenvioLoading] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(60);
  const [podeReenviar, setPodeReenviar] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Timer para reenvio
  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => {
        setTempoRestante(tempoRestante - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setPodeReenviar(true);
    }
  }, [tempoRestante]);

  // Foco no primeiro input quando carrega
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Aceita apenas números
    if (!/^\d*$/.test(value)) return;

    const novosCodigos = [...codigo];
    novosCodigos[index] = value;
    setCodigo(novosCodigos);

    // Auto-foco no próximo input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace para voltar ao input anterior
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Enter para tentar validar se todos os campos estão preenchidos
    if (e.key === "Enter") {
      const codigoCompleto = codigo.join("");
      if (codigoCompleto.length === 6) {
        handleValidacao();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = pastedText.replace(/\D/g, "").slice(0, 6);
    
    if (digits.length === 6) {
      const novoCodigo = digits.split("");
      setCodigo(novoCodigo);
      // Foca no último input preenchido
      inputRefs.current[5]?.focus();
    }
  };

  const handleValidacao = async () => {
    const codigoCompleto = codigo.join("");
    
    if (codigoCompleto.length !== 6) {
      toast.error("Por favor, digite o código de 6 dígitos completo");
      return;
    }

    setLoading(true);
    try {
      if (onValidacao) {
        await onValidacao(codigoCompleto);
      } else {
        // Simulação de validação
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Código validado com sucesso!");
        navigate("/home");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Código inválido. Tente novamente.";
      toast.error(errorMessage);
      // Limpa o código e foca no primeiro input
      setCodigo(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleReenvio = async () => {
    setReenvioLoading(true);
    try {
      if (onReenvio) {
        await onReenvio();
      } else {
        // Simulação de reenvio
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Novo código enviado para seu email!");
      }
      
      // Reset do timer
      setTempoRestante(60);
      setPodeReenviar(false);
      
      // Limpa os inputs e foca no primeiro
      setCodigo(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao reenviar código. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setReenvioLoading(false);
    }
  };

  const codigoCompleto = codigo.join("").length === 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verificação de Segurança
            </h2>
            <p className="text-gray-600 mt-2">
              Digite o código de 6 dígitos enviado para
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {email}
              </span>
            </div>
          </div>

          {/* Campos de código */}
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {codigo.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    digit
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 hover:border-gray-400 focus:border-green-500"
                  }`}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Indicador de progresso */}
            <div className="flex justify-center">
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      codigo[index]
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botão de validação */}
          <Botao
            onClick={handleValidacao}
            larguraTotal
            tamanho="grande"
            carregando={loading}
            disabled={!codigoCompleto}
            icone={codigoCompleto ? CheckCircle : undefined}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </Botao>

          {/* Opções de reenvio */}
          <div className="text-center space-y-3">
            {!podeReenviar ? (
              <p className="text-sm text-gray-500">
                Você pode solicitar um novo código em{" "}
                <span className="font-medium text-green-600">
                  {Math.floor(tempoRestante / 60)}:
                  {(tempoRestante % 60).toString().padStart(2, "0")}
                </span>
              </p>
            ) : (
              <Botao
                onClick={handleReenvio}
                variante="contorno"
                carregando={reenvioLoading}
                icone={RefreshCw}
                className="text-sm"
              >
                {reenvioLoading ? "Reenviando..." : "Reenviar código"}
              </Botao>
            )}
          </div>

          {/* Link para voltar */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </button>
          </div>
        </div>

        {/* Dicas de segurança */}
        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> O código é válido por 10 minutos. 
              Se não recebeu o email, verifique sua caixa de spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioValidacao2FA;
import React, { useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import Logo from "../components/atoms/Logo";
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Botao";
import { toast } from "react-toastify";
import confirmarReseteDeSenha from "../services/auth/confirmar-resete-de-senha";

/**
 * Página acessada pelo link do e-mail: /resetar-senha?token=...
 * Boas práticas:
 *  - Lê token apenas da URL
 *  - Não persiste token em storage
 *  - Valida força/confirmação de senha no cliente
 *  - Trata token ausente/expirado
 */
const ResetarSenha: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useMemo(
    () => new URLSearchParams(location.search).get("token") || "",
    [location.search]
  );

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<{ senha?: string; confirmacao?: string }>(
    {}
  );

  // Validação simples de força (pode evoluir com zxcvbn se quiser)
  const forca = useMemo(() => {
    let score = 0;
    if (senha.length >= 8) score++;
    if (/[A-Z]/.test(senha)) score++;
    if (/[a-z]/.test(senha)) score++;
    if (/\d/.test(senha)) score++;
    if (/[^A-Za-z0-9]/.test(senha)) score++;
    return score; // 0..5
  }, [senha]);

  const textoForca =
    ["Muito fraca", "Fraca", "Ok", "Boa", "Forte", "Excelente"][forca] ||
    "Muito fraca";

  const validar = () => {
    const n: typeof erros = {};
    if (!token) {
      toast.error("Link inválido. Solicite um novo e-mail de recuperação.");
      return false;
    }
    if (!senha || senha.length < 8) {
      n.senha = "A senha deve ter pelo menos 8 caracteres.";
    }
    if (senha && senha === senha.toLowerCase()) {
      // apenas uma dica, não bloqueia — ajuste se quiser obrigar letra maiúscula
      // n.senha = "Use ao menos uma letra maiúscula.";
    }
    if (confirmacao !== senha) {
      n.confirmacao = "As senhas não conferem.";
    }
    setErros(n);
    return Object.keys(n).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      setCarregando(true);
      await confirmarReseteDeSenha(token, senha);
      toast.success(
        "Senha redefinida com sucesso! Faça login com a nova senha."
      );
      // Por segurança, limpa campos e redireciona
      setSenha("");
      setConfirmacao("");
      navigate("/", { replace: true });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Não foi possível redefinir a senha.";
      // mensagens comuns do backend: "Token expirado", "Token inválido"
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  };

  // Token ausente → mostra cartão de erro e atalho para nova solicitação
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            <Logo className="mb-4 w-48" />
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-yellow-800 mb-1">
                Link inválido
              </h2>
              <p className="text-yellow-700">
                Não encontramos um token de recuperação válido. Solicite um novo
                link.
              </p>
            </div>
            <Link
              to="/esqueci-a-senha"
              className="inline-flex mt-6 items-center justify-center w-full px-4 py-3 rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Solicitar novo link
            </Link>
          </div>
          <div className="bg-gray-50 px-8 py-4 text-center text-sm">
            <Link
              to="/"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo className="mb-4 w-48" />
            <h2 className="text-3xl font-bold text-gray-900">
              Definir nova senha
            </h2>
            <p className="text-gray-600 mt-2">
              Crie uma senha forte para manter sua conta segura.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Nova senha */}
            <div className="relative">
              <Input
                type={mostrarSenha ? "text" : "password"}
                rotulo="Nova senha"
                placeholder="Mínimo de 8 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                icone={Lock}
                erro={erros.senha}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setMostrarSenha((s) => !s)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {/* Indicador de força simples */}
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded ${
                      [
                        "bg-red-500",
                        "bg-orange-500",
                        "bg-yellow-500",
                        "bg-lime-500",
                        "bg-green-500",
                        "bg-green-600",
                      ][forca]
                    }`}
                    style={{ width: `${(forca / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{textoForca}</span>
              </div>
            </div>

            {/* Confirmar senha */}
            <div>
              <Input
                type="password"
                rotulo="Confirmar senha"
                placeholder="Digite novamente"
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                icone={ShieldCheck}
                erro={erros.confirmacao}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              larguraTotal
              tamanho="grande"
              carregando={carregando}
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Salvar nova senha"}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>
                Se o link estiver expirado,{" "}
                <Link
                  to="/esqueci-a-senha"
                  className="text-green-600 hover:text-green-500"
                >
                  solicite outro
                </Link>
                .
              </p>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 px-8 py-4 text-center text-sm">
          <Link
            to="/"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetarSenha;

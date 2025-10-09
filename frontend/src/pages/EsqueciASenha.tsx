import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Logo from "../components/atoms/Logo";
import { toast } from "react-toastify";
import solicitarReseteDeSenha from "../services/auth/solicitar-resete-de-senha";

const EsqueciASenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await solicitarReseteDeSenha(email);
      setEnviado(true);
      toast.success("Email de recuperação enviado com sucesso!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar email de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <Logo className="mb-4 w-48" />
            <h2 className="text-3xl font-bold text-gray-900">
              Esqueceu sua senha?
            </h2>
            <p className="text-gray-600 mt-2">
              {enviado
                ? "Verifique sua caixa de entrada para continuar."
                : "Insira seu e-mail para receber um link de recuperação."}
            </p>
          </div>

          {enviado ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Link enviado!
                </h3>
                <p className="text-green-700">
                  Enviamos um link de recuperação para <strong>{email}</strong>.
                  Por favor, verifique sua caixa de entrada e pasta de spam.
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="seu-email@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                  {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="bg-gray-50 px-8 py-4 text-center text-sm">
          <Link
            to="/"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Lembrou a senha? Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EsqueciASenha;

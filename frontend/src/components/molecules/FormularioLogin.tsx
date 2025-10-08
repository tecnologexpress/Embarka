import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Input from "../atoms/Input";
import Button from "../atoms/Botao";
import { Link } from "react-router-dom";
import login from "../../services/auth/login";
import { toast } from "react-toastify/unstyled";
import { mensagemDeErro } from "../../utils/mensagem-erro";

interface FormularioLoginProps {
  email: string;
  setEmail: (email: string) => void;
  onLoginSucesso: () => void;
}

const FormularioLogin: React.FC<FormularioLoginProps> = ({
  email,
  setEmail,
  onLoginSucesso,
}) => {
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    const novosErros: { email?: string; senha?: string } = {};

    if (!email) {
      novosErros.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      novosErros.email = "Email inválido";
    }

    if (!senha) {
      novosErros.senha = "Senha é obrigatória";
    } else if (senha.length < 6) {
      novosErros.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    if (validarFormulario()) {
      try {
        await login(email, senha);
        onLoginSucesso();
      } catch (erro) {
        toast.error(mensagemDeErro(erro));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={aoSubmeter} className="space-y-6">
      <div>
        <Input
          type="email"
          rotulo="Email"
          placeholder="seu.email@exemplo.com"
          minLength={5}
          maxLength={100}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icone={Mail}
          erro={erros.email}
          autoComplete="email"
        />
      </div>

      <div>
        <div className="relative">
          <Input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Digite sua senha"
            rotulo="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            icone={Lock}
            erro={erros.senha}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setMostrarSenha(!mostrarSenha)}
          >
            {mostrarSenha ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
        </label>

        <a
          href="#"
          className="text-sm text-green-600 hover:text-green-500 transition-colors"
        >
          Esqueceu a senha?
        </a>
      </div>

      <Button type="submit" larguraTotal carregando={loading} tamanho="grande">
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link
            to="/registrar"
            className="text-green-600 hover:text-green-500 font-medium transition-colors"
          >
            Cadastre-se
          </Link>
        </span>
      </div>
    </form>
  );
};

export default FormularioLogin;

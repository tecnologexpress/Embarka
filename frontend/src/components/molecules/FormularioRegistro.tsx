import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Hash,
  Phone,
  MapPin,
  Home,
  Calendar,
  Check,
  X,
} from "lucide-react";
import Input from "../atoms/Input";
import type { IPessoaDTO } from "../../dto/pessoa";
import { useLocalizacao } from "../../hooks/useLocalizacao";
import { useMudancaFormularioUniversal } from "../../hooks/useMudancaFormularioUniversal";
import registrar from "../../services/registro/registrar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { mensagemDeErro } from "../../utils/mensagem-erro";
import Botao from "../atoms/Botao";

// Critérios de validação de senha
const criteriosSenha = {
  tamanho: {
    label: "Pelo menos 8 caracteres",
    regex: /.{8,}/,
  },
  minuscula: {
    label: "Uma letra minúscula (a-z)",
    regex: /[a-z]/,
  },
  maiuscula: {
    label: "Uma letra maiúscula (A-Z)",
    regex: /[A-Z]/,
  },
  numero: {
    label: "Um número (0-9)",
    regex: /\d/,
  },
  especial: {
    label: "Um caractere especial (!@#$%&*)",
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
};

const FORMULARIO_INICIAL: IPessoaDTO = {
  ds_documento: "",
  ds_descricao: "",
  dt_origem: "", // Inicia o campo de data vazio
  ds_email: "",
  ds_telefone: "",
  ds_pais: "Brasil",
  ds_estado: "",
  nr_codigo_ibge: 0,
  ds_bairro: "",
  ds_cep: "",
  ds_endereco: "",
  ds_endereco_numero: "",
  ds_celular: "",
  ds_site: "",
  ds_complemento: "",
  ds_instagram: "",
  ds_linkedin: "",
  ds_twitter: "",
  ds_facebook: "",
  ds_tratamento: "",
};

const FormularioRegistro = () => {
  const [formulario, setFormulario] = useState<IPessoaDTO>(FORMULARIO_INICIAL);
  const { estados, municipios, carregandoEstados, carregandoMunicipios } =
    useLocalizacao(formulario.ds_estado);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [erros, setErros] = useState<{
    senha?: string;
    confirmarSenha?: string;
  }>({});

  // Estado para validação em tempo real da senha
  const [validacaoSenha, setValidacaoSenha] = useState({
    tamanho: false,
    minuscula: false,
    maiuscula: false,
    numero: false,
    especial: false,
  });

  const validarSenha = (valor: string) => {
    if (!valor) return "Senha é obrigatória";

    // Validar cada critério individualmente
    const validacao = {
      tamanho: criteriosSenha.tamanho.regex.test(valor),
      minuscula: criteriosSenha.minuscula.regex.test(valor),
      maiuscula: criteriosSenha.maiuscula.regex.test(valor),
      numero: criteriosSenha.numero.regex.test(valor),
      especial: criteriosSenha.especial.regex.test(valor),
    };

    setValidacaoSenha(validacao);

    // Verificar se todos os critérios foram atendidos
    const todosCriteriosAtendidos = Object.values(validacao).every(Boolean);
    if (!todosCriteriosAtendidos) {
      return "A senha deve atender todos os critérios de segurança";
    }

    return "";
  };
  const validarConfirmacao = (valor: string, original: string) => {
    if (!valor) return "Confirmação obrigatória";
    if (valor !== original) return "As senhas não coincidem";
    return "";
  };
  const validarCamposSenha = (s = senha, c = confirmarSenha) => {
    const e1 = validarSenha(s);
    const e2 = validarConfirmacao(c, s);
    setErros({ senha: e1 || undefined, confirmarSenha: e2 || undefined });
    return !e1 && !e2;
  };

  const { aoMudar } = useMudancaFormularioUniversal<IPessoaDTO>(
    formulario,
    setFormulario,
    {
      // limpeza/normalização declarativa
      camposSomenteDigitos: ["ds_telefone", "ds_celular", "ds_cep"],
      camposSomenteAlfanumericos: ["ds_documento"],
      camposMaiusculos: ["ds_estado"],
      camposNumericos: ["nr_codigo_ibge"],
      camposData: ["dt_origem"],
    }
  );

  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCamposSenha()) return;

    try {
      setLoading(true);
      await registrar({ data: formulario, senha });
      toast.success("Registro cadastrado com sucesso! Efetue o seu login.");
      navigate("/");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(mensagemDeErro(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={aoSubmeter}
      className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-8"
    >
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Crie sua conta
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Preencha os dados abaixo para começar a usar a plataforma.
        </p>
      </div>

      {/* Dados principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="text"
          rotulo="Documento (CNPJ) *"
          name="ds_documento"
          mascara="cnpj"
          value={formulario.ds_documento}
          onChange={aoMudar}
          icone={Hash}
          autoComplete="off"
          required
        />
        <div className="relative">
          <label className="sr-only" htmlFor="dt_origem">
            Abertura da empresa
          </label>
          <Input
            id="dt_origem"
            type="date"
            rotulo="Abertura da empresa *"
            name="dt_origem"
            value={
              formulario.dt_origem instanceof Date
                ? formulario.dt_origem.toISOString().slice(0, 10)
                : String(formulario.dt_origem)
            }
            onChange={aoMudar}
            icone={Calendar}
            required
          />
        </div>
        <Input
          type="text"
          rotulo="Razão social *"
          placeholder="Ex.: Transportes Silva LTDA"
          name="ds_descricao"
          value={formulario.ds_descricao}
          onChange={aoMudar}
          icone={User}
          autoComplete="name"
          required
        />
        <Input
          type="text"
          rotulo="Nome Fantasia"
          placeholder="Ex.: Transportes Express"
          name="ds_tratamento"
          value={formulario.ds_tratamento}
          onChange={aoMudar}
          icone={User}
          autoComplete="name"
        />
        <Input
          type="tel"
          rotulo="Telefone *"
          placeholder="(12) 3456-7890"
          mascara="telefone"
          name="ds_telefone"
          value={formulario.ds_telefone}
          onChange={aoMudar}
          icone={Phone}
          autoComplete="tel"
          required
        />
        <Input
          type="tel"
          rotulo="Celular"
          placeholder="(12) 93456-7890"
          mascara="celular"
          name="ds_celular"
          value={formulario.ds_celular || ""}
          onChange={aoMudar}
          icone={Phone}
          autoComplete="tel-national"
        />
      </div>

      <br />

      {/* Endereço */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          type="text"
          rotulo="CEP *"
          placeholder="Somente números"
          name="ds_cep"
          mascara="cep"
          value={formulario.ds_cep}
          onChange={aoMudar}
          icone={Home}
          inputMode="numeric"
          maxLength={8}
          required
        />
        <Input
          type="text"
          rotulo="Bairro *"
          name="ds_bairro"
          value={formulario.ds_bairro}
          onChange={aoMudar}
          icone={Home}
          autoComplete="address-level2"
          divClassName="col-span-2"
          required
        />
        <Input
          type="text"
          rotulo="Endereço *"
          name="ds_endereco"
          divClassName="col-span-2"
          value={formulario.ds_endereco}
          onChange={aoMudar}
          icone={Home}
          autoComplete="street-address"
          required
        />
        <Input
          type="text"
          rotulo="Número *"
          name="ds_endereco_numero"
          value={formulario.ds_endereco_numero}
          onChange={aoMudar}
          icone={Home}
          required
        />
        <Input
          type="text"
          rotulo="Complemento"
          name="ds_complemento"
          divClassName="col-span-full"
          value={formulario.ds_complemento || ""}
          onChange={aoMudar}
          icone={Home}
        />
        <Input
          type="text"
          rotulo="País *"
          name="ds_pais"
          value={formulario.ds_pais}
          onChange={aoMudar}
          icone={MapPin}
          autoComplete="country-name"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado (UF) *
          </label>
          <select
            name="ds_estado"
            value={formulario.ds_estado}
            onChange={aoMudar}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={carregandoEstados}
            required
          >
            <option value="">
              {carregandoEstados ? "Carregando UFs..." : "Selecione a UF"}
            </option>
            {estados.map((uf) => (
              <option key={uf.value} value={String(uf.value)}>
                {uf.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Município *
          </label>
          <select
            name="nr_codigo_ibge"
            value={formulario.nr_codigo_ibge || 0}
            onChange={aoMudar}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!formulario.ds_estado || carregandoMunicipios}
            required
          >
            <option value={0}>
              {!formulario.ds_estado
                ? "Selecione uma UF primeiro"
                : carregandoMunicipios
                ? "Carregando municípios..."
                : "Selecione o município"}
            </option>
            {municipios.map((m) => (
              <option key={m.value} value={Number(m.value)}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sites / Redes sociais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          type="text"
          rotulo="Site"
          placeholder="https://..."
          name="ds_site"
          value={formulario.ds_site || ""}
          onChange={aoMudar}
        />
        <Input
          type="text"
          rotulo="Instagram"
          placeholder="@seu_perfil"
          name="ds_instagram"
          value={formulario.ds_instagram || ""}
          onChange={aoMudar}
        />
        <Input
          type="text"
          rotulo="LinkedIn"
          placeholder="empresa/pessoa"
          name="ds_linkedin"
          value={formulario.ds_linkedin || ""}
          onChange={aoMudar}
        />
        <Input
          type="text"
          rotulo="Twitter"
          placeholder="@usuario"
          name="ds_twitter"
          value={formulario.ds_twitter || ""}
          onChange={aoMudar}
        />
        <Input
          type="text"
          rotulo="Facebook"
          placeholder="/pagina"
          name="ds_facebook"
          value={formulario.ds_facebook || ""}
          onChange={aoMudar}
        />
      </div>

      <br />

      {/* Login */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          type="email"
          rotulo="Email *"
          placeholder="seu.email@exemplo.com"
          name="ds_email"
          value={formulario.ds_email}
          onChange={aoMudar}
          icone={Mail}
          autoComplete="email"
          divClassName="col-span-full"
          required
        />

        <div className="col-span-full relative">
          <Input
            type={mostrarSenha ? "text" : "password"}
            rotulo="Senha *"
            placeholder="Digite uma senha forte"
            value={senha}
            onChange={(e) => {
              const v = e.target.value;
              setSenha(v);
              validarCamposSenha(v, confirmarSenha);
            }}
            onBlur={() => validarCamposSenha()}
            icone={Lock}
            autoComplete="new-password"
            erro={erros.senha}
            textoAjuda={
              !senha
                ? "Digite pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e símbolos"
                : undefined
            }
            required
          />
          <button
            type="button"
            onClick={() => setMostrarSenha((s) => !s)}
            className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={-1}
          >
            {mostrarSenha ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="col-span-full relative">
          <Input
            type={mostrarConfirma ? "text" : "password"}
            rotulo="Confirmar senha *"
            placeholder="Confirme a senha"
            value={confirmarSenha}
            onChange={(e) => {
              const v = e.target.value;
              setConfirmarSenha(v);
              validarCamposSenha(senha, v);
            }}
            onBlur={() => validarCamposSenha()}
            icone={Lock}
            autoComplete="new-password"
            erro={erros.confirmarSenha}
            required
          />
          <button
            type="button"
            onClick={() => setMostrarConfirma((s) => !s)}
            className="absolute right-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={
              mostrarConfirma ? "Ocultar confirmação" : "Mostrar confirmação"
            }
            tabIndex={-1}
          >
            {mostrarConfirma ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
          {/* Indicadores visuais de validação da senha */}
          {senha && (
            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Critérios de segurança da senha:
              </p>
              <div className="space-y-2">
                {Object.entries(criteriosSenha).map(([key, criterio]) => {
                  const isValid =
                    validacaoSenha[key as keyof typeof validacaoSenha];
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        isValid ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-4 h-4 rounded-full transition-colors duration-200 ${
                          isValid
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {isValid ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </div>
                      <span className={isValid ? "font-medium" : ""}>
                        {criterio.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-4 pt-8">
        <div className="flex flex-row gap-4 justify-between">
          <Botao
            type="button"
            larguraTotal
            tamanho="grande"
            variante="secundario"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Botao>
          <Botao
            type="submit"
            larguraTotal
            carregando={loading}
            tamanho="grande"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </Botao>
        </div>
        <p className="text-start text-sm text-gray-500">
          * Campos obrigatórios
        </p>
        <p className="text-center text-sm text-gray-600 mt-4">
          Ao continuar, você concorda com nossos{" "}
          <a
            href="#"
            className="text-green-600 hover:text-green-500 font-medium transition-colors"
          >
            Termos de Uso
          </a>{" "}
          e{" "}
          <a
            href="#"
            className="text-green-600 hover:text-green-500 font-medium transition-colors"
          >
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </form>
  );
};

export default FormularioRegistro;

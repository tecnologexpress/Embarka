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
} from "lucide-react";
import Input from "../atoms/Input";
import Button from "../atoms/Botao";
import { consultarCep } from "../../services/consulta-cep";
import type { IPessoaDTO } from "../../dto/pessoa";
import { useBuscaPessoa } from "../../hooks/useBuscaPessoa";
import { useLocalizacao } from "../../hooks/useLocalizacao";

const FormularioRegistro = () => {
  const [formulario, setFormulario] = useState<IPessoaDTO>({
    ds_documento: "",
    ds_descricao: "",
    dt_origem: new Date(),
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
    ds_inscricao_estadual: "",
  });
  const { buscarPessoa } = useBuscaPessoa();
  // antes: const { estados, municipios, ... } = useLocalizacao();
  const { estados, municipios, carregandoEstados, carregandoMunicipios } =
    useLocalizacao(formulario.ds_estado);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirma, setMostrarConfirma] = useState(false);

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler para buscar pessoa ao sair do campo de documento
  const handleDocumentoBlur = async () => {
    const doc = formulario.ds_documento;
    if (!doc || doc.length < 11) return;
    const dados = await buscarPessoa(doc);
    if (dados) {
      setFormulario((prev) => ({
        ...prev,
        ds_documento: dados.ds_documento || prev.ds_documento,
        ds_descricao: dados.ds_descricao || prev.ds_descricao,
        dt_origem: dados.dt_origem ? new Date(dados.dt_origem) : prev.dt_origem,
        ds_email: dados.ds_email || prev.ds_email,
        ds_telefone: dados.ds_telefone || prev.ds_telefone,
        ds_pais: dados.ds_pais || "Brasil",
        ds_estado: dados.ds_estado || prev.ds_estado,
        nr_codigo_ibge: dados.nr_codigo_ibge || prev.nr_codigo_ibge,
        ds_bairro: dados.ds_bairro || prev.ds_bairro,
        ds_cep: dados.ds_cep || prev.ds_cep,
        ds_endereco: dados.ds_endereco || prev.ds_endereco,
        ds_endereco_numero: dados.ds_endereco_numero || prev.ds_endereco_numero,
        ds_complemento: dados.ds_complemento || prev.ds_complemento,
      }));
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Para campos numéricos, converter para número
    const parsedValue =
      type === "number" || name === "nr_codigo_ibge"
        ? value === ""
          ? ""
          : Number(value)
        : value;

    if (name === "ds_cep" && value.length === 8) {
      try {
        const dadosCep = await consultarCep(value);
        setFormulario((prev) => ({
          ...prev,
          ds_cep: value,
          ds_endereco: dadosCep.logradouro,
          ds_bairro: dadosCep.bairro,
          ds_estado: dadosCep.uf,
          nr_codigo_ibge: Number(dadosCep.ibge),
        }));
      } catch {
        setFormulario((prev) => ({
          ...prev,
          ds_cep: value,
          ds_endereco: "",
          ds_bairro: "",
          ds_estado: "",
          nr_codigo_ibge: 0,
        }));
        // toast.error(error?.response?.data?.message || "Erro ao consultar CEP.");
      }
    } else if (name === "ds_cep" && value.length < 8) {
      setFormulario((prev) => ({
        ...prev,
        ds_cep: value,
        ds_endereco: "",
        ds_bairro: "",
        ds_estado: "",
        nr_codigo_ibge: 0,
      }));
    } else if (name === "dt_origem") {
      setFormulario((prev) => ({
        ...prev,
        dt_origem: value ? new Date(value) : new Date(),
      }));
    } else {
      setFormulario((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const handleUfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uf = e.target.value.toUpperCase();
    setFormulario((prev) => ({
      ...prev,
      ds_estado: uf,
      nr_codigo_ibge: 0, // zera município até o usuário escolher
    }));
  };

  const handleMunicipioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codigo = Number(e.target.value) || 0;
    setFormulario((prev) => ({ ...prev, nr_codigo_ibge: codigo }));
  };

  const aoSubmeter = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Aqui vai a lógica de submit
    setTimeout(() => setLoading(false), 1000);
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
          rotulo="Razão social"
          placeholder="Ex.: Transportes Silva LTDA"
          name="ds_descricao"
          value={formulario.ds_descricao}
          onChange={handleChange}
          icone={User}
          autoComplete="name"
        />
        <Input
          type="text"
          rotulo="Documento (CNPJ)"
          placeholder="Somente números"
          name="ds_documento"
          value={formulario.ds_documento}
          onChange={handleChange}
          onBlur={handleDocumentoBlur}
          icone={Hash}
          autoComplete="off"
        />
        <Input
          type="email"
          rotulo="Email"
          placeholder="seu.email@exemplo.com"
          name="ds_email"
          value={formulario.ds_email}
          onChange={handleChange}
          icone={Mail}
          autoComplete="email"
        />
        <Input
          type="tel"
          rotulo="Telefone"
          placeholder="(00) 0000-0000 / (00) 00000-0000"
          name="ds_telefone"
          value={formulario.ds_telefone}
          onChange={handleChange}
          icone={Phone}
          autoComplete="tel"
        />
      </div>

      {/* Senhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <Input
            type={mostrarSenha ? "text" : "password"}
            rotulo="Senha"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            icone={Lock}
            autoComplete="new-password"
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
        <div className="relative">
          <Input
            type={mostrarConfirma ? "text" : "password"}
            rotulo="Confirmar senha"
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            icone={Lock}
            autoComplete="new-password"
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
        </div>
      </div>

      {/* Contato extra */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="tel"
          rotulo="Celular (opcional)"
          placeholder="(00) 00000-0000"
          name="ds_celular"
          value={formulario.ds_celular || ""}
          onChange={handleChange}
          icone={Phone}
          autoComplete="tel-national"
        />
        <Input
          type="text"
          rotulo="Site (opcional)"
          placeholder="https://..."
          name="ds_site"
          value={formulario.ds_site || ""}
          onChange={handleChange}
        />
      </div>

      {/* Endereço */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          type="text"
          rotulo="País"
          name="ds_pais"
          value={formulario.ds_pais}
          onChange={handleChange}
          icone={MapPin}
          autoComplete="country-name"
        />
        {/* UF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado (UF)
          </label>
          <select
            name="ds_estado"
            value={formulario.ds_estado}
            onChange={handleUfChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={carregandoEstados}
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

        {/* Município (exibe nome, salva nr_codigo_ibge) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Município
          </label>
          <select
            name="nr_codigo_ibge"
            value={formulario.nr_codigo_ibge || 0}
            onChange={handleMunicipioChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!formulario.ds_estado || carregandoMunicipios}
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
        <Input
          type="text"
          rotulo="Bairro"
          name="ds_bairro"
          value={formulario.ds_bairro}
          onChange={handleChange}
          icone={Home}
          autoComplete="address-level2"
        />
        <Input
          type="text"
          rotulo="CEP"
          placeholder="Somente números"
          name="ds_cep"
          value={formulario.ds_cep}
          onChange={handleChange}
          icone={Home}
          inputMode="numeric"
          maxLength={8}
        />
        <Input
          type="text"
          rotulo="Endereço"
          name="ds_endereco"
          value={formulario.ds_endereco}
          onChange={handleChange}
          icone={Home}
          autoComplete="street-address"
        />
        <Input
          type="text"
          rotulo="Número"
          name="ds_endereco_numero"
          value={formulario.ds_endereco_numero}
          onChange={handleChange}
          icone={Home}
        />
        <Input
          type="text"
          rotulo="Complemento (opcional)"
          name="ds_complemento"
          value={formulario.ds_complemento || ""}
          onChange={handleChange}
          icone={Home}
        />
        <div className="relative">
          <label className="sr-only" htmlFor="dt_origem">
            Abertura da empresa
          </label>
          <Input
            id="dt_origem"
            type="date"
            rotulo="Abertura da empresa"
            name="dt_origem"
            value={
              formulario.dt_origem instanceof Date
                ? formulario.dt_origem.toISOString().slice(0, 10)
                : String(formulario.dt_origem)
            }
            onChange={handleChange}
            icone={Calendar}
          />
        </div>
      </div>

      {/* Redes sociais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          type="text"
          rotulo="Instagram (opcional)"
          placeholder="@seu_perfil"
          name="ds_instagram"
          value={formulario.ds_instagram || ""}
          onChange={handleChange}
        />
        <Input
          type="text"
          rotulo="LinkedIn (opcional)"
          placeholder="empresa/pessoa"
          name="ds_linkedin"
          value={formulario.ds_linkedin || ""}
          onChange={handleChange}
        />
        <Input
          type="text"
          rotulo="Twitter (opcional)"
          placeholder="@usuario"
          name="ds_twitter"
          value={formulario.ds_twitter || ""}
          onChange={handleChange}
        />
        <Input
          type="text"
          rotulo="Facebook (opcional)"
          placeholder="/pagina"
          name="ds_facebook"
          value={formulario.ds_facebook || ""}
          onChange={handleChange}
        />
        <Input
          type="text"
          rotulo="Inscrição Estadual (opcional)"
          name="ds_inscricao_estadual"
          value={formulario.ds_inscricao_estadual || ""}
          onChange={handleChange}
        />
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          larguraTotal
          carregando={loading}
          tamanho="grande"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-gray-600">
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

import React from "react";
import type { LucideIcon } from "lucide-react";
import Logo from "../atoms/Logo";
import Botao from "../atoms/Botao";

interface Sugestao {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  acao: () => void;
}

interface Acao {
  rotulo: string;
  acao: () => void;
  icone: LucideIcon;
}

interface InfoAjuda {
  email: string;
  telefone: string;
}

interface PropsTemplateErro {
  codigoErro: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  sugestoes?: Sugestao[];
  acaoPrimaria: Acao;
  acaoSecundaria?: Acao;
  infoAjuda?: InfoAjuda;
}

/**
 * Componente de template para exibição de páginas de erro personalizadas.
 *
 * Exibe informações detalhadas sobre o erro, sugestões de navegação, ações principais/secundárias
 * e informações de contato para suporte.
 *
 * @component
 *
 * @param {PropsTemplateErro} props - Propriedades do componente.
 * @param {string} props.codigoErro - Código do erro a ser exibido (ex: 404, 500).
 * @param {string} props.titulo - Título principal do erro.
 * @param {string} props.descricao - Descrição detalhada do erro.
 * @param {Array<{
 *   titulo: string;
 *   descricao: string;
 *   icone: React.ElementType;
 *   acao: () => void;
 * }>} [props.sugestoes=[]] - Lista de sugestões de navegação, cada uma com título, descrição, ícone e ação.
 * @param {{
 *   rotulo: string;
 *   icone?: React.ElementType;
 *   acao: () => void;
 * }} props.acaoPrimaria - Ação principal sugerida ao usuário, com rótulo, ícone e função de clique.
 * @param {{
 *   rotulo: string;
 *   icone?: React.ElementType;
 *   acao: () => void;
 * }} [props.acaoSecundaria] - Ação secundária opcional, com rótulo, ícone e função de clique.
 * @param {{
 *   email: string;
 *   telefone: string;
 * }} [props.infoAjuda] - Informações de contato para suporte, incluindo e-mail e telefone.
 *
 * @returns {JSX.Element} Estrutura visual da página de erro personalizada.
 */
const TemplateErro: React.FC<PropsTemplateErro> = ({
  codigoErro,
  titulo,
  descricao,
  sugestoes = [],
  acaoPrimaria,
  acaoSecundaria,
  infoAjuda,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-green-400 via-green-400 to-green-600 text-white p-12 text-center relative overflow-hidden">
            <div className="text-center mb-12 flex items-center flex-col">
              <Logo className="mb-8 w-[300px]" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                Conectando Embarcadores • Clientes • Transportadoras
              </p>
            </div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4">
                {codigoErro} - <span>{titulo}</span>
              </h1>
              {/* <h2 className="text-2xl font-semibold mb-4">{titulo}</h2> */}
              <p className="text-green-100 text-lg max-w-2xl mx-auto">
                {descricao}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-12">
            {sugestoes.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Onde você pode ir
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {sugestoes.map((sugestao, indice) => (
                    <button
                      key={indice}
                      onClick={sugestao.acao}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center mr-4 transition-colors">
                          <sugestao.icone className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {sugestao.titulo}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {sugestao.descricao}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Botao
                variante="primario"
                tamanho="grande"
                icone={acaoPrimaria.icone}
                onClick={acaoPrimaria.acao}
                className="min-w-48"
              >
                {acaoPrimaria.rotulo}
              </Botao>
              {acaoSecundaria && (
                <Botao
                  variante="contorno"
                  tamanho="grande"
                  icone={acaoSecundaria.icone}
                  onClick={acaoSecundaria.acao}
                  className="min-w-48"
                >
                  {acaoSecundaria.rotulo}
                </Botao>
              )}
            </div>

            {/* Help Section */}
            {infoAjuda && (
              <div className="text-center bg-gray-50 rounded-xl p-8">
                <div className="h-8 w-8 text-gray-400 mx-auto mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ainda precisa de ajuda?
                </h3>
                <p className="text-gray-600 mb-4">
                  Nossa equipe de suporte está sempre pronta para otimizar sua
                  experiência logística.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                  <a
                    href={`mailto:${infoAjuda.email}`}
                    className="text-green-600 hover:text-green-500 font-medium"
                  >
                    {infoAjuda.email}
                  </a>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <a
                    href={`tel:${infoAjuda.telefone}`}
                    className="text-green-600 hover:text-green-500 font-medium"
                  >
                    {infoAjuda.telefone}
                  </a>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <span className="text-gray-600">Suporte 24/7</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Embarka - Revolucionando a Cadeia Logística Brasileira</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateErro;

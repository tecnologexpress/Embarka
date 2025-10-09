import React from "react";
import TBody from "../tabela/TBody";
import Td from "../tabela/Td";
import Th from "../tabela/Th";
import THead from "../tabela/THead";
import Tabela from "../tabela/Tabela";
import SpinnerCarregamento from "../atoms/SpinnerCarregamento";
import DadosVazios from "./NenhumDadoEncontradoTemplate";
import {
  FileQuestion,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import TRCorpo from "../tabela/TrBody";
import TrCabecalho from "../tabela/TrCabecalho";

export interface IColunaTabela<T> {
  // A chave é tipada para garantir que seja uma chave válida do objeto T, suportando aninhamento (string).
  key: keyof T | string;
  label: string;
  width?: string;
  ordenavel?: boolean;
  // Permite formatar o valor (ex: data para string)
  formatador?: (valor: unknown, item: T) => string | React.ReactNode;
  // Permite renderizar um componente React complexo (ex: badges, ícones)
  renderizador?: (item: T) => React.ReactNode;
}

// O tipo base TData será usado internamente para operações que exigem acesso por string.
// No entanto, removemos a restrição 'T extends TData' da função para sermos mais flexíveis.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TData = Record<string, any>; // Tipo mais flexível para evitar conflitos de interface

interface Props<T extends object> {
  // Restrição mais leve
  dados: T[];
  colunas: IColunaTabela<T>[];
  carregando?: boolean;
  ordenarColuna?: string;
  ordenarDirecao?: "ASC" | "DESC";
  onOrdenarColuna?: (coluna: string) => void;
  tituloMensagemVazia?: string;
  tituloDescricaoVazia?: string;
  iconeDadosVazios?: React.ReactNode;
  rotuloAcaoMensagemVazia?: string;
  aoAcionarBotaoMensagemVazio?: () => void;
}

// Componente para o indicador de ordenação
const IconeOrdenacao = (
  coluna: string,
  ordenarColuna?: string,
  ordenarDirecao?: "ASC" | "DESC"
) => {
  if (coluna !== ordenarColuna) {
    return (
      <ChevronsUpDown className="w-4 h-4 text-gray-400 transition-colors duration-200" />
    );
  }

  return ordenarDirecao === "ASC" ? (
    <ChevronUp className="w-4 h-4 text-green-600 transition-colors duration-200" />
  ) : (
    <ChevronDown className="w-4 h-4 text-green-600 transition-colors duration-200" />
  );
};

// TabelaGenerica agora aceita qualquer objeto como T
/**
 * Componente de tabela genérica reutilizável para exibição de dados tabulares.
 *
 * Permite renderizar qualquer tipo de dado, com suporte a ordenação, renderização customizada de células,
 * exibição de mensagens e ícones para estados vazios, e indicador de carregamento.
 *
 * @template T Tipo dos dados de cada linha da tabela.
 *
 * @param props
 * @param props.dados Lista de objetos a serem exibidos nas linhas da tabela.
 * @param props.colunas Definição das colunas, incluindo chave, rótulo, renderizador e opções de ordenação.
 * @param [props.carregando=false] Indica se a tabela está em estado de carregamento.
 * @param [props.ordenarColuna] Chave da coluna atualmente ordenada.
 * @param [props.ordenarDirecao] Direção da ordenação ("asc" ou "desc").
 * @param [props.onOrdenarColuna] Callback acionado ao clicar para ordenar uma coluna.
 * @param [props.tituloMensagemVazia="Nenhum resultado encontrado."] Título exibido quando não há dados.
 * @param [props.tituloDescricaoVazia="Adicione o primeiro registro para começar."] Descrição exibida quando não há dados.
 * @param [props.iconeDadosVazios] Ícone exibido quando não há dados.
 * @param [props.rotuloAcaoMensagemVazia="Adicionar registro"] Rótulo do botão de ação exibido quando não há dados.
 * @param [props.aoAcionarBotaoMensagemVazio] Callback acionado ao clicar no botão de ação quando não há dados.
 *
 * @returns JSX.Element Tabela renderizada com cabeçalho, corpo, estados de carregamento e vazio.
 *
 * @example
 * <TabelaGenerica
 *   dados={listaDeUsuarios}
 *   colunas={[
 *     { key: 'nome', label: 'Nome', ordenavel: true },
 *     { key: 'email', label: 'E-mail' },
 *     { key: 'ativo', label: 'Ativo', formatador: (valor) => valor ? 'Sim' : 'Não' }
 *   ]}
 *   carregando={false}
 *   ordenarColuna="nome"
 *   ordenarDirecao="asc"
 *   onOrdenarColuna={(coluna) => setOrdenacao(coluna)}
 * />
 *
 * @function obterValorAninhado
 * Função utilitária para acessar valores aninhados em objetos a partir de uma string de caminho (ex: "usuario.nome").
 *
 * @function formatarValorPadrao
 * Formata valores para exibição padrão na célula, tratando tipos comuns (null, boolean, Date, objetos).
 *
 * @function renderizarCorpo
 * Renderiza o corpo da tabela, exibindo linhas de dados, estado de carregamento ou mensagem de vazio conforme necessário.
 */
const TabelaGenerica = <T extends object>({
  dados,
  colunas,
  carregando = false,
  ordenarColuna,
  ordenarDirecao,
  onOrdenarColuna,
  // Valores para estado vazio
  tituloMensagemVazia = "Nenhum resultado encontrado.",
  tituloDescricaoVazia = "Adicione o primeiro registro para começar.",
  iconeDadosVazios = <FileQuestion className="w-10 h-10 text-gray-400" />,
  rotuloAcaoMensagemVazia = "Adicionar registro",
  aoAcionarBotaoMensagemVazio = () => {},
}: Props<T>) => {
  const colSpanTotal = colunas.length;

  // Função mais segura para obter valores aninhados
  const obterValorAninhado = (item: T, caminho: string): unknown => {
    return caminho
      .split(".")
      .reduce<unknown>((valorAtual: unknown, chave: string) => {
        // Usa TData para realizar o acesso via string, garantindo que o TypeScipt aceite
        if (
          valorAtual &&
          typeof valorAtual === "object" &&
          chave in (valorAtual as TData)
        ) {
          return (valorAtual as TData)[chave];
        }
        return undefined;
      }, item);
  };

  function formatarValorPadrao(VALOR: unknown) {
    if (VALOR === null || VALOR === undefined) return "-";
    if (typeof VALOR === "boolean") return VALOR ? "Sim" : "Não";
    if (VALOR instanceof Date) return VALOR.toLocaleDateString();
    if (typeof VALOR === "object") return JSON.stringify(VALOR);
    return String(VALOR);
  }

  // Renderização do corpo da tabela
  const renderizarCorpo = () => {
    if (carregando) {
      return (
        <TRCorpo>
          <Td colSpan={colSpanTotal} className="text-center">
            <div className="flex justify-center items-center py-12">
              <SpinnerCarregamento />
            </div>
          </Td>
        </TRCorpo>
      );
    }

    if (dados.length === 0) {
      return (
        <TRCorpo>
          <Td colSpan={colSpanTotal} className="text-center">
            <div className="flex justify-center py-12">
              <DadosVazios
                titulo={tituloMensagemVazia}
                descricao={tituloDescricaoVazia}
                icone={iconeDadosVazios}
                rotuloAcao={rotuloAcaoMensagemVazia}
                aoAcionar={aoAcionarBotaoMensagemVazio}
              />
            </div>
          </Td>
        </TRCorpo>
      );
    }

    return (
      <>
        {dados.map((item, index) => {
          const keyValue = index;

          return (
            <TRCorpo key={keyValue} clickable={false}>
              {colunas.map((col) => {
                const VALOR = obterValorAninhado(item, String(col.key));

                const conteudo = col.renderizador
                  ? col.renderizador(item)
                  : col.formatador
                  ? col.formatador(VALOR, item)
                  : formatarValorPadrao(VALOR);

                // O título do tooltip é o valor do conteúdo, se for uma string
                const titleAttr =
                  typeof conteudo === "string" ? conteudo : undefined;

                return (
                  <Td
                    key={String(col.key)}
                    title={titleAttr}
                    truncate={true}
                    className={col.width ? `w-${col.width}` : ""}
                  >
                    {conteudo}
                  </Td>
                );
              })}
            </TRCorpo>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full">
      {/* Wrapper responsivo com scroll horizontal em telas pequenas */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Tabela className="table-auto min-w-full">
            <THead>
              <TrCabecalho>
                {colunas.map((col, index) => (
                  <Th
                    key={index}
                    ordenavel={col.ordenavel}
                    className={`
                      ${col.width ? `w-${col.width}` : "min-w-0"}
                      ${
                        col.ordenavel && onOrdenarColuna ? "cursor-pointer" : ""
                      }
                    `}
                    onClick={() =>
                      col.ordenavel && onOrdenarColuna?.(String(col.key))
                    }
                  >
                    <div className="flex items-center justify-center">
                      <span className="font-semibold">{col.label}</span>
                      {col.ordenavel && (
                        <div className="ml-2 flex-shrink-0">
                          {IconeOrdenacao(
                            String(col.key),
                            ordenarColuna,
                            ordenarDirecao
                          )}
                        </div>
                      )}
                    </div>
                  </Th>
                ))}
              </TrCabecalho>
            </THead>
            <TBody>{renderizarCorpo()}</TBody>
          </Tabela>
        </div>
      </div>
    </div>
  );
};

export default TabelaGenerica;

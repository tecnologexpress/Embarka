import React from "react";
import TBody from "../tabela/TBody";
import Td from "../tabela/Td";
import Th from "../tabela/Th";
import THead from "../tabela/THead";
import Tabela from "../tabela/Tabela";
import SpinnerCarregamento from "../atoms/SpinnerCarregamento";
import DadosVazios from "./NenhumDadoEncontradoTemplate";
import { FileQuestion } from "lucide-react";
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
  if (coluna !== ordenarColuna)
    return (
      // Ícone neutro com classes mais semânticas
      <span className="text-sm text-gray-400 flex flex-col leading-none ml-1">
        ⇅
      </span>
    );
  // Ícones mais claros
  return ordenarDirecao === "ASC" ? (
    <span className="text-sm ml-1">▲</span>
  ) : (
    <span className="text-sm ml-1">▼</span>
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
          <Td colSpan={colSpanTotal}>
            <div className="flex justify-center py-8">
              {/* Assumindo que SpinnerCarregamento é um componente válido */}
              <SpinnerCarregamento />
            </div>
          </Td>
        </TRCorpo>
      );
    }

    if (dados.length === 0) {
      return (
        <TRCorpo>
          <Td colSpan={colSpanTotal}>
            <div className="flex justify-center py-8">
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
            <TrCabecalho key={keyValue} className="border-t">
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
                    className={`
                      ${col.width || "max-w-[300px]"} 
                      truncate 
                      text-gray-700
                    `}
                  >
                    {conteudo}
                  </Td>
                );
              })}
            </TrCabecalho>
          );
        })}
      </>
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <Tabela className="min-w-full text-center text-sm data-table">
        <THead>
          <TrCabecalho className="text-gray-600 border-b">
            {colunas.map((col, index) => (
              <Th
                key={index}
                className={`
                  ${col.width || "max-w-[300px]"}
                  ${
                    col.ordenavel && onOrdenarColuna
                      ? "cursor-pointer"
                      : "cursor-default"
                  }
                `}
                onClick={() =>
                  col.ordenavel && onOrdenarColuna?.(String(col.key))
                }
              >
                <span className="flex items-center gap-1 font-semibold">
                  {col.label}
                  {col.ordenavel &&
                    IconeOrdenacao(
                      String(col.key),
                      ordenarColuna,
                      ordenarDirecao
                    )}
                </span>
              </Th>
            ))}
          </TrCabecalho>
        </THead>
        <TBody>{renderizarCorpo()}</TBody>
      </Tabela>
    </div>
  );
};

export default TabelaGenerica;

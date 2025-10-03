// Tipos para o sistema logístico da Embarka

export interface Embarcador {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  status: 'ativo' | 'inativo' | 'suspenso';
  certificacoes: string[];
}

export interface Cliente {
  id: string;
  documento: string; // CPF ou CNPJ
  nome: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  preferencias: PreferenciasCliente;
}

export interface Transportadora {
  id: string;
  cnpj: string;
  razaoSocial: string;
  email: string;
  telefone: string;
  frota: Veiculo[];
  certificacoes: string[];
  avaliacaoAmbiental: number; // Score SGA
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  coordenadas?: {
    latitude: number;
    longitude: number;
  };
}

export interface Veiculo {
  id: string;
  placa: string;
  tipo: 'caminhao' | 'carreta' | 'van' | 'moto';
  capacidade: number;
  emissaoCO2: number; // Para SGA
  status: 'disponivel' | 'em_transito' | 'manutencao';
}

export interface PreferenciasCliente {
  notificacoes: boolean;
  rastreamento: boolean;
  relatoriosAmbientais: boolean;
}

export interface Carga {
  id: string;
  embarcadorId: string;
  clienteId: string;
  transportadoraId?: string;
  origem: Endereco;
  destino: Endereco;
  peso: number;
  volume: number;
  valorDeclarado: number;
  status: StatusCarga;
  dataColeta: Date;
  dataEntregaPrevista: Date;
  impactoAmbiental?: ImpactoAmbiental;
}

export type StatusCarga = 
  | 'pendente'
  | 'coletada'
  | 'em_transito'
  | 'entregue'
  | 'cancelada'
  | 'extraviada';

export interface ImpactoAmbiental {
  emissaoCO2: number;
  compensacaoCarbon: boolean;
  rotaOtimizada: boolean;
  certificacaoVerde: boolean;
}

export interface RelatorioAuditoria {
  id: string;
  cargaId: string;
  timestampInicio: Date;
  timestampFim: Date;
  localizacoes: Localizacao[];
  eventos: EventoAuditoria[];
  conformidade: boolean;
}

export interface Localizacao {
  timestamp: Date;
  latitude: number;
  longitude: number;
  velocidade?: number;
  endereco?: string;
}

export interface EventoAuditoria {
  id: string;
  tipo: 'coleta' | 'entrega' | 'parada' | 'desvio' | 'incidente';
  timestamp: Date;
  descricao: string;
  evidencias?: string[]; // URLs de fotos/documentos
  responsavel: string;
}

export interface DashboardMetrics {
  totalCargas: number;
  cargasEmAndamento: number;
  eficienciaEntrega: number; // Percentual
  reducaoCO2: number; // Toneladas
  avaliacaoClientes: number; // Média de 1-5
  custosLogisticos: number;
}
// Constantes para o sistema logístico da Embarka

export const LOGISTICS_CONSTANTS = {
  // Tipos de veículos e suas capacidades
  VEHICLE_TYPES: {
    caminhao: {
      name: 'Caminhão',
      maxWeight: 16000, // kg
      maxVolume: 90, // m³
      avgConsumption: 3.5, // km/l
      co2Factor: 2.6 // kg CO2/l
    },
    carreta: {
      name: 'Carreta',
      maxWeight: 45000, // kg
      maxVolume: 150, // m³
      avgConsumption: 2.8, // km/l
      co2Factor: 2.6 // kg CO2/l
    },
    van: {
      name: 'Van',
      maxWeight: 3500, // kg
      maxVolume: 15, // m³
      avgConsumption: 8.0, // km/l
      co2Factor: 2.3 // kg CO2/l
    },
    moto: {
      name: 'Moto',
      maxWeight: 300, // kg
      maxVolume: 0.5, // m³
      avgConsumption: 35.0, // km/l
      co2Factor: 2.3 // kg CO2/l
    }
  },

  // Status das cargas com cores
  CARGO_STATUS: {
    pendente: {
      label: 'Pendente',
      color: 'yellow',
      description: 'Aguardando coleta'
    },
    coletada: {
      label: 'Coletada',
      color: 'blue',
      description: 'Coletada, aguardando transporte'
    },
    em_transito: {
      label: 'Em Trânsito',
      color: 'orange',
      description: 'Em transporte para destino'
    },
    entregue: {
      label: 'Entregue',
      color: 'green',
      description: 'Entregue no destino'
    },
    cancelada: {
      label: 'Cancelada',
      color: 'red',
      description: 'Transporte cancelado'
    },
    extraviada: {
      label: 'Extraviada',
      color: 'red',
      description: 'Carga extraviada'
    }
  },

  // Certificações ambientais
  ENVIRONMENTAL_CERTIFICATIONS: {
    ISO14001: 'ISO 14001 - Sistema de Gestão Ambiental',
    CARBONNEUTRAL: 'Carbon Neutral - Compensação de Emissões',
    GREENLOGISTICS: 'Green Logistics - Logística Sustentável',
    SMARTCITY: 'Smart City Partner - Parceiro Cidade Inteligente'
  },

  // Certificações logísticas
  LOGISTICS_CERTIFICATIONS: {
    ANTT: 'ANTT - Agência Nacional de Transportes Terrestres',
    ANVISA: 'ANVISA - Medicamentos e Produtos Controlados',
    INMETRO: 'INMETRO - Produtos Regulamentados',
    OEA: 'OEA - Operador Econômico Autorizado',
    CTRC: 'CTRC - Conhecimento de Transporte Rodoviário de Cargas'
  },

  // Tipos de auditoria
  AUDIT_TYPES: {
    coleta: {
      label: 'Coleta',
      icon: 'package',
      color: 'blue'
    },
    entrega: {
      label: 'Entrega',
      icon: 'truck',
      color: 'green'
    },
    parada: {
      label: 'Parada',
      icon: 'pause-circle',
      color: 'yellow'
    },
    desvio: {
      label: 'Desvio de Rota',
      icon: 'map-pin',
      color: 'orange'
    },
    incidente: {
      label: 'Incidente',
      icon: 'alert-triangle',
      color: 'red'
    }
  },

  // Metas SGA (Sistema de Gestão Ambiental)
  SGA_TARGETS: {
    CO2_REDUCTION: 30, // % redução até 2030
    FUEL_EFFICIENCY: 20, // % melhoria na eficiência
    WASTE_REDUCTION: 50, // % redução de resíduos
    RENEWABLE_ENERGY: 80, // % energia renovável
    CARBON_OFFSET: 100 // % compensação de carbono
  },

  // KPIs principais
  KEY_METRICS: {
    ONTIME_DELIVERY: 'Taxa de Entrega no Prazo',
    FUEL_CONSUMPTION: 'Consumo de Combustível',
    CO2_EMISSIONS: 'Emissões de CO2',
    ROUTE_OPTIMIZATION: 'Otimização de Rotas',
    CUSTOMER_SATISFACTION: 'Satisfação do Cliente',
    COST_PER_KM: 'Custo por Quilômetro',
    CARGO_DAMAGE: 'Taxa de Avarias',
    VEHICLE_UTILIZATION: 'Utilização da Frota'
  },

  // Estados brasileiros para operação
  OPERATIONAL_STATES: [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ],

  // Horários de operação
  BUSINESS_HOURS: {
    start: '06:00',
    end: '22:00',
    emergencySupport: '24/7'
  }
};

// Configurações de IA
export const AI_CONFIG = {
  ROUTE_OPTIMIZATION: {
    algorithm: 'genetic_algorithm',
    factors: ['distance', 'traffic', 'fuel_cost', 'delivery_time', 'co2_emissions'],
    updateInterval: 300000, // 5 minutos em ms
    maxAlternatives: 3
  },
  
  DEMAND_PREDICTION: {
    model: 'time_series_forecasting',
    timeHorizon: 30, // dias
    confidence: 0.85,
    updateFrequency: 'daily'
  },

  RISK_ASSESSMENT: {
    factors: ['weather', 'traffic', 'cargo_value', 'route_security', 'vehicle_condition'],
    threshold: 0.7,
    alertLevels: ['low', 'medium', 'high', 'critical']
  }
};
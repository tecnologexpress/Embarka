// DTOs de criação/edição + tipos de resposta

export interface ICriarJanelaDeColeta {
  ds_dia_da_semana: string;      // 'SEGUNDA'...'DOMINGO'
  hr_horario_inicio: string;    // 'HH:mm' ou 'HH:mm:ss'
  hr_horario_fim: string;      // 'HH:mm' ou 'HH:mm:ss'
  hr_horario_intervalo_inicio?: string; // opcional
  hr_horario_intervalo_fim?: string;   // opcional
}

export interface IAtualizarJanelaDeColetaDto extends ICriarJanelaDeColeta {
  id_janela_de_coleta_fornecedor: number;
}

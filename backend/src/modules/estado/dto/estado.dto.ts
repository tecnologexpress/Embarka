import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

/**
 * DTO para criação de Estado
 * @description Dados necessários para criar um novo estado
 */
export class CreateEstadoDto {
  /**
   * Nome do estado
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Nome do estado',
    example: 'São Paulo',
    maxLength: 21,
  })
  @IsNotEmpty({ message: 'Nome do estado é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(21, { message: 'Nome deve ter no máximo 21 caracteres' })
  nome: string;

  /**
   * Sigla do estado
   * @example "SP"
   */
  @ApiProperty({
    description: 'Sigla do estado',
    example: 'SP',
    maxLength: 2,
  })
  @IsNotEmpty({ message: 'Sigla do estado é obrigatória' })
  @IsString({ message: 'Sigla deve ser uma string' })
  @MaxLength(2, { message: 'Sigla deve ter no máximo 2 caracteres' })
  sigla: string;
}

/**
 * DTO para atualização de Estado
 * @description Dados que podem ser atualizados em um estado
 */
export class UpdateEstadoDto {
  /**
   * Nome do estado
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Nome do estado',
    example: 'São Paulo',
    maxLength: 21,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(21, { message: 'Nome deve ter no máximo 21 caracteres' })
  nome?: string;

  /**
   * Sigla do estado
   * @example "SP"
   */
  @ApiProperty({
    description: 'Sigla do estado',
    example: 'SP',
    maxLength: 2,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Sigla deve ser uma string' })
  @MaxLength(2, { message: 'Sigla deve ter no máximo 2 caracteres' })
  sigla?: string;
}
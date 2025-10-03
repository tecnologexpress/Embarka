import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsNumber, IsPositive } from 'class-validator';

/**
 * DTO para criação de Município
 * @description Dados necessários para criar um novo município
 */
export class CreateMunicipioDto {
  /**
   * Código IBGE do município
   * @example 3550308
   */
  @ApiProperty({
    description: 'Código IBGE do município',
    example: 3550308,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Código IBGE deve ser um número' })
  @IsPositive({ message: 'Código IBGE deve ser positivo' })
  codigoIbge?: number;

  /**
   * Nome do município
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Nome do município',
    example: 'São Paulo',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Nome do município é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  /**
   * Nome oficial do município
   * @example "Município de São Paulo"
   */
  @ApiProperty({
    description: 'Nome oficial do município',
    example: 'Município de São Paulo',
    maxLength: 150,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome oficial deve ser uma string' })
  @MaxLength(150, { message: 'Nome oficial deve ter no máximo 150 caracteres' })
  nomeOficial?: string;

  /**
   * UF do município
   * @example "SP"
   */
  @ApiProperty({
    description: 'UF do município',
    example: 'SP',
    maxLength: 2,
  })
  @IsNotEmpty({ message: 'UF é obrigatória' })
  @IsString({ message: 'UF deve ser uma string' })
  @MaxLength(2, { message: 'UF deve ter no máximo 2 caracteres' })
  uf: string;

  /**
   * Latitude do município
   * @example "-23.5505"
   */
  @ApiProperty({
    description: 'Latitude do município',
    example: '-23.5505',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Latitude deve ser uma string' })
  @MaxLength(20, { message: 'Latitude deve ter no máximo 20 caracteres' })
  latitude?: string;

  /**
   * Longitude do município
   * @example "-46.6333"
   */
  @ApiProperty({
    description: 'Longitude do município',
    example: '-46.6333',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Longitude deve ser uma string' })
  @MaxLength(20, { message: 'Longitude deve ter no máximo 20 caracteres' })
  longitude?: string;

  /**
   * ID do estado
   * @example 1
   */
  @ApiProperty({
    description: 'ID do estado',
    example: 1,
  })
  @IsNotEmpty({ message: 'ID do estado é obrigatório' })
  @IsNumber({}, { message: 'ID do estado deve ser um número' })
  @IsPositive({ message: 'ID do estado deve ser positivo' })
  estadoId: number;
}

/**
 * DTO para atualização de Município
 * @description Dados que podem ser atualizados em um município
 */
export class UpdateMunicipioDto {
  /**
   * Código IBGE do município
   * @example 3550308
   */
  @ApiProperty({
    description: 'Código IBGE do município',
    example: 3550308,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Código IBGE deve ser um número' })
  @IsPositive({ message: 'Código IBGE deve ser positivo' })
  codigoIbge?: number;

  /**
   * Nome do município
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Nome do município',
    example: 'São Paulo',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome?: string;

  /**
   * Nome oficial do município
   * @example "Município de São Paulo"
   */
  @ApiProperty({
    description: 'Nome oficial do município',
    example: 'Município de São Paulo',
    maxLength: 150,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome oficial deve ser uma string' })
  @MaxLength(150, { message: 'Nome oficial deve ter no máximo 150 caracteres' })
  nomeOficial?: string;

  /**
   * UF do município
   * @example "SP"
   */
  @ApiProperty({
    description: 'UF do município',
    example: 'SP',
    maxLength: 2,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'UF deve ser uma string' })
  @MaxLength(2, { message: 'UF deve ter no máximo 2 caracteres' })
  uf?: string;

  /**
   * Latitude do município
   * @example "-23.5505"
   */
  @ApiProperty({
    description: 'Latitude do município',
    example: '-23.5505',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Latitude deve ser uma string' })
  @MaxLength(20, { message: 'Latitude deve ter no máximo 20 caracteres' })
  latitude?: string;

  /**
   * Longitude do município
   * @example "-46.6333"
   */
  @ApiProperty({
    description: 'Longitude do município',
    example: '-46.6333',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Longitude deve ser uma string' })
  @MaxLength(20, { message: 'Longitude deve ter no máximo 20 caracteres' })
  longitude?: string;

  /**
   * ID do estado
   * @example 1
   */
  @ApiProperty({
    description: 'ID do estado',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'ID do estado deve ser um número' })
  @IsPositive({ message: 'ID do estado deve ser positivo' })
  estadoId?: number;
}
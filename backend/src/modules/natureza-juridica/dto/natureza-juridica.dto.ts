import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsBoolean, IsIn } from 'class-validator';

/**
 * DTO para criação de Natureza Jurídica
 * @description Dados necessários para criar uma nova natureza jurídica
 */
export class CreateNaturezaJuridicaDto {
  /**
   * Descrição da natureza jurídica
   * @example "Pessoa Física"
   */
  @ApiProperty({
    description: 'Descrição da natureza jurídica',
    example: 'Pessoa Física',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(100, { message: 'Descrição deve ter no máximo 100 caracteres' })
  descricao: string;

  /**
   * Código da natureza jurídica
   * @example "F"
   */
  @ApiProperty({
    description: 'Código da natureza jurídica (F-Física, J-Jurídica)',
    example: 'F',
    enum: ['F', 'J'],
  })
  @IsNotEmpty({ message: 'Código é obrigatório' })
  @IsString({ message: 'Código deve ser uma string' })
  @IsIn(['F', 'J'], { message: 'Código deve ser F (Física) ou J (Jurídica)' })
  codigo: string;

  /**
   * Indica se a natureza está ativa
   * @example true
   */
  @ApiProperty({
    description: 'Indica se a natureza está ativa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ativa deve ser um valor booleano' })
  ativa?: boolean;
}

/**
 * DTO para atualização de Natureza Jurídica
 * @description Dados que podem ser atualizados em uma natureza jurídica
 */
export class UpdateNaturezaJuridicaDto {
  /**
   * Descrição da natureza jurídica
   * @example "Pessoa Física"
   */
  @ApiProperty({
    description: 'Descrição da natureza jurídica',
    example: 'Pessoa Física',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(100, { message: 'Descrição deve ter no máximo 100 caracteres' })
  descricao?: string;

  /**
   * Código da natureza jurídica
   * @example "F"
   */
  @ApiProperty({
    description: 'Código da natureza jurídica (F-Física, J-Jurídica)',
    example: 'F',
    enum: ['F', 'J'],
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Código deve ser uma string' })
  @IsIn(['F', 'J'], { message: 'Código deve ser F (Física) ou J (Jurídica)' })
  codigo?: string;

  /**
   * Indica se a natureza está ativa
   * @example true
   */
  @ApiProperty({
    description: 'Indica se a natureza está ativa',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Ativa deve ser um valor booleano' })
  ativa?: boolean;
}
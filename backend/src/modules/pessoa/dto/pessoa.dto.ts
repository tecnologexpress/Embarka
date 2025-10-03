import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsNumber, IsPositive, IsEmail } from 'class-validator';

/**
 * DTO para criação de Pessoa
 * @description Dados necessários para criar uma nova pessoa
 */
export class CreatePessoaDto {
  /**
   * Documento da pessoa (CPF/CNPJ)
   * @example "12345678901"
   */
  @ApiProperty({
    description: 'Documento da pessoa (CPF/CNPJ)',
    example: '12345678901',
    maxLength: 14,
  })
  @IsNotEmpty({ message: 'Documento é obrigatório' })
  @IsString({ message: 'Documento deve ser uma string' })
  @MaxLength(14, { message: 'Documento deve ter no máximo 14 caracteres' })
  documento: string;

  /**
   * Email da pessoa
   * @example "pessoa@email.com"
   */
  @ApiProperty({
    description: 'Email da pessoa',
    example: 'pessoa@email.com',
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  @MaxLength(50, { message: 'Email deve ter no máximo 50 caracteres' })
  email: string;

  /**
   * Descrição da pessoa
   * @example "Cliente VIP"
   */
  @ApiProperty({
    description: 'Descrição da pessoa',
    example: 'Cliente VIP',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(50, { message: 'Descrição deve ter no máximo 50 caracteres' })
  descricao?: string;

  /**
   * Tratamento da pessoa
   * @example "Sr."
   */
  @ApiProperty({
    description: 'Tratamento da pessoa',
    example: 'Sr.',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tratamento deve ser uma string' })
  @MaxLength(50, { message: 'Tratamento deve ter no máximo 50 caracteres' })
  tratamento?: string;

  /**
   * Origem da pessoa
   * @example "Indicação"
   */
  @ApiProperty({
    description: 'Origem da pessoa',
    example: 'Indicação',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Origem deve ser uma string' })
  @MaxLength(50, { message: 'Origem deve ter no máximo 50 caracteres' })
  origem?: string;

  /**
   * Telefone da pessoa
   * @example "1199999999"
   */
  @ApiProperty({
    description: 'Telefone da pessoa',
    example: '1199999999',
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @MaxLength(10, { message: 'Telefone deve ter no máximo 10 caracteres' })
  telefone?: string;

  /**
   * Celular da pessoa
   * @example "11999999999"
   */
  @ApiProperty({
    description: 'Celular da pessoa',
    example: '11999999999',
    maxLength: 11,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Celular deve ser uma string' })
  @MaxLength(11, { message: 'Celular deve ter no máximo 11 caracteres' })
  celular?: string;

  /**
   * País da pessoa
   * @example "Brasil"
   */
  @ApiProperty({
    description: 'País da pessoa',
    example: 'Brasil',
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'País deve ser uma string' })
  @MaxLength(30, { message: 'País deve ter no máximo 30 caracteres' })
  pais?: string;

  /**
   * Estado da pessoa
   * @example "São Paulo"
   */
  @ApiProperty({
    description: 'Estado da pessoa',
    example: 'São Paulo',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Estado deve ser uma string' })
  @MaxLength(20, { message: 'Estado deve ter no máximo 20 caracteres' })
  estado?: string;

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
   * Bairro da pessoa
   * @example "Centro"
   */
  @ApiProperty({
    description: 'Bairro da pessoa',
    example: 'Centro',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Bairro deve ser uma string' })
  @MaxLength(50, { message: 'Bairro deve ter no máximo 50 caracteres' })
  bairro?: string;

  /**
   * CEP da pessoa
   * @example 12345678
   */
  @ApiProperty({
    description: 'CEP da pessoa',
    example: 12345678,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'CEP deve ser um número' })
  @IsPositive({ message: 'CEP deve ser positivo' })
  cep?: number;

  /**
   * Endereço da pessoa
   * @example "Rua das Flores, 123"
   */
  @ApiProperty({
    description: 'Endereço da pessoa',
    example: 'Rua das Flores, 123',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Endereço deve ser uma string' })
  @MaxLength(50, { message: 'Endereço deve ter no máximo 50 caracteres' })
  endereco?: string;

  /**
   * Número do endereço
   * @example "123"
   */
  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Número deve ser uma string' })
  @MaxLength(10, { message: 'Número deve ter no máximo 10 caracteres' })
  numero?: string;

  /**
   * Complemento do endereço
   * @example "Apt 45"
   */
  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Apt 45',
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  @MaxLength(30, { message: 'Complemento deve ter no máximo 30 caracteres' })
  complemento?: string;

  /**
   * Site da pessoa/empresa
   * @example "www.empresa.com.br"
   */
  @ApiProperty({
    description: 'Site da pessoa/empresa',
    example: 'www.empresa.com.br',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Site deve ser uma string' })
  @MaxLength(50, { message: 'Site deve ter no máximo 50 caracteres' })
  site?: string;

  /**
   * Instagram da pessoa/empresa
   * @example "@usuario"
   */
  @ApiProperty({
    description: 'Instagram da pessoa/empresa',
    example: '@usuario',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Instagram deve ser uma string' })
  @MaxLength(50, { message: 'Instagram deve ter no máximo 50 caracteres' })
  instagram?: string;

  /**
   * LinkedIn da pessoa/empresa
   * @example "linkedin.com/in/usuario"
   */
  @ApiProperty({
    description: 'LinkedIn da pessoa/empresa',
    example: 'linkedin.com/in/usuario',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'LinkedIn deve ser uma string' })
  @MaxLength(50, { message: 'LinkedIn deve ter no máximo 50 caracteres' })
  linkedin?: string;

  /**
   * Twitter da pessoa/empresa
   * @example "@usuario"
   */
  @ApiProperty({
    description: 'Twitter da pessoa/empresa',
    example: '@usuario',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Twitter deve ser uma string' })
  @MaxLength(50, { message: 'Twitter deve ter no máximo 50 caracteres' })
  twitter?: string;

  /**
   * Facebook da pessoa/empresa
   * @example "facebook.com/usuario"
   */
  @ApiProperty({
    description: 'Facebook da pessoa/empresa',
    example: 'facebook.com/usuario',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Facebook deve ser uma string' })
  @MaxLength(50, { message: 'Facebook deve ter no máximo 50 caracteres' })
  facebook?: string;

  /**
   * Inscrição estadual da empresa
   * @example "123.456.789.012"
   */
  @ApiProperty({
    description: 'Inscrição estadual',
    example: '123.456.789.012',
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Inscrição estadual deve ser uma string' })
  @MaxLength(20, { message: 'Inscrição estadual deve ter no máximo 20 caracteres' })
  inscricaoEstadual?: string;
}

/**
 * DTO para atualização de Pessoa
 * @description Dados que podem ser atualizados em uma pessoa
 */
export class UpdatePessoaDto {
  /**
   * Documento da pessoa (CPF/CNPJ)
   * @example "12345678901"
   */
  @ApiProperty({
    description: 'Documento da pessoa (CPF/CNPJ)',
    example: '12345678901',
    maxLength: 14,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Documento deve ser uma string' })
  @MaxLength(14, { message: 'Documento deve ter no máximo 14 caracteres' })
  documento?: string;

  /**
   * Email da pessoa
   * @example "pessoa@email.com"
   */
  @ApiProperty({
    description: 'Email da pessoa',
    example: 'pessoa@email.com',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter formato válido' })
  @MaxLength(50, { message: 'Email deve ter no máximo 50 caracteres' })
  email?: string;

  /**
   * Descrição da pessoa
   * @example "Cliente VIP"
   */
  @ApiProperty({
    description: 'Descrição da pessoa',
    example: 'Cliente VIP',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MaxLength(50, { message: 'Descrição deve ter no máximo 50 caracteres' })
  descricao?: string;

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
}
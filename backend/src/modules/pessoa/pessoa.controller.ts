import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PessoaService } from './pessoa.service';
import { CreatePessoaDto, UpdatePessoaDto } from './dto/pessoa.dto';
import { Pessoa } from './pessoa.entity';

/**
 * Controlador para gerenciamento de Pessoas
 * @description Endpoints REST para operações CRUD de pessoas físicas e jurídicas
 */
@ApiTags('Pessoas')
@Controller('pessoas')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  /**
   * Cria uma nova pessoa
   * @param createPessoaDto - Dados da pessoa a ser criada
   * @returns Pessoa criada
   */
  @Post()
  @ApiOperation({ 
    summary: 'Criar pessoa',
    description: 'Cria uma nova pessoa (física ou jurídica) no sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Pessoa criada com sucesso',
    type: Pessoa
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Município não encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Pessoa com este documento/email já existe'
  })
  async create(@Body() createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
    return this.pessoaService.create(createPessoaDto);
  }

  /**
   * Lista todas as pessoas
   * @returns Lista de todas as pessoas cadastradas
   */
  @Get()
  @ApiOperation({ 
    summary: 'Listar pessoas',
    description: 'Retorna lista de todas as pessoas cadastradas'
  })
  @ApiQuery({
    name: 'municipioId',
    required: false,
    description: 'Filtrar por ID do município',
    type: Number
  })
  @ApiQuery({
    name: 'natureza',
    required: false,
    description: 'Filtrar por natureza (fisica/juridica)',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pessoas retornada com sucesso',
    type: [Pessoa]
  })
  async findAll(
    @Query('municipioId') municipioId?: number,
    @Query('natureza') natureza?: string,
  ): Promise<Pessoa[]> {
    if (municipioId) {
      return this.pessoaService.findByMunicipio(municipioId);
    }
    if (natureza) {
      return this.pessoaService.findByNatureza(natureza);
    }
    return this.pessoaService.findAll();
  }

  /**
   * Busca pessoa por ID
   * @param id - ID da pessoa
   * @returns Pessoa encontrada
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar pessoa por ID',
    description: 'Retorna uma pessoa específica pelo seu ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da pessoa',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa encontrada',
    type: Pessoa
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Pessoa> {
    return this.pessoaService.findOne(id);
  }

  /**
   * Busca pessoa por documento
   * @param documento - Documento da pessoa (CPF/CNPJ)
   * @returns Pessoa encontrada
   */
  @Get('documento/:documento')
  @ApiOperation({ 
    summary: 'Buscar pessoa por documento',
    description: 'Retorna uma pessoa específica pelo seu documento (CPF/CNPJ)'
  })
  @ApiParam({ 
    name: 'documento', 
    description: 'Documento da pessoa',
    example: '12345678901'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa encontrada',
    type: Pessoa
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada'
  })
  async findByDocumento(@Param('documento') documento: string): Promise<Pessoa> {
    return this.pessoaService.findByDocumento(documento);
  }

  /**
   * Busca pessoa por email
   * @param email - Email da pessoa
   * @returns Pessoa encontrada
   */
  @Get('email/:email')
  @ApiOperation({ 
    summary: 'Buscar pessoa por email',
    description: 'Retorna uma pessoa específica pelo seu email'
  })
  @ApiParam({ 
    name: 'email', 
    description: 'Email da pessoa',
    example: 'pessoa@email.com'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa encontrada',
    type: Pessoa
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada'
  })
  async findByEmail(@Param('email') email: string): Promise<Pessoa> {
    return this.pessoaService.findByEmail(email);
  }

  /**
   * Lista pessoas por município
   * @param municipioId - ID do município
   * @returns Lista de pessoas do município
   */
  @Get('municipio/:municipioId')
  @ApiOperation({ 
    summary: 'Listar pessoas por município',
    description: 'Retorna lista de pessoas de um município específico'
  })
  @ApiParam({ 
    name: 'municipioId', 
    description: 'ID do município',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pessoas do município',
    type: [Pessoa]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Município não encontrado'
  })
  async findByMunicipio(@Param('municipioId', ParseIntPipe) municipioId: number): Promise<Pessoa[]> {
    return this.pessoaService.findByMunicipio(municipioId);
  }

  /**
   * Lista pessoas por natureza
   * @param natureza - Natureza da pessoa (fisica/juridica)
   * @returns Lista de pessoas da natureza especificada
   */
  @Get('natureza/:natureza')
  @ApiOperation({ 
    summary: 'Listar pessoas por natureza',
    description: 'Retorna lista de pessoas de uma natureza específica (física ou jurídica)'
  })
  @ApiParam({ 
    name: 'natureza', 
    description: 'Natureza da pessoa',
    example: 'fisica'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de pessoas da natureza especificada',
    type: [Pessoa]
  })
  async findByNatureza(@Param('natureza') natureza: string): Promise<Pessoa[]> {
    return this.pessoaService.findByNatureza(natureza);
  }

  /**
   * Atualiza uma pessoa
   * @param id - ID da pessoa
   * @param updatePessoaDto - Dados para atualização
   * @returns Pessoa atualizada
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar pessoa',
    description: 'Atualiza os dados de uma pessoa existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da pessoa',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Pessoa atualizada com sucesso',
    type: Pessoa
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflito com dados existentes'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ): Promise<Pessoa> {
    return this.pessoaService.update(id, updatePessoaDto);
  }

  /**
   * Remove uma pessoa
   * @param id - ID da pessoa
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remover pessoa',
    description: 'Remove uma pessoa do sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da pessoa',
    example: 1
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Pessoa removida com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Pessoa não encontrada'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.pessoaService.remove(id);
  }

  /**
   * Conta total de pessoas
   * @returns Número total de pessoas cadastradas
   */
  @Get('count/total')
  @ApiOperation({ 
    summary: 'Contar pessoas',
    description: 'Retorna o número total de pessoas cadastradas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 1250 }
      }
    }
  })
  async count(): Promise<{ total: number }> {
    const total = await this.pessoaService.count();
    return { total };
  }

  /**
   * Conta pessoas por natureza
   * @param natureza - Natureza das pessoas
   * @returns Número de pessoas da natureza especificada
   */
  @Get('count/natureza/:natureza')
  @ApiOperation({ 
    summary: 'Contar pessoas por natureza',
    description: 'Retorna o número de pessoas de uma natureza específica'
  })
  @ApiParam({ 
    name: 'natureza', 
    description: 'Natureza da pessoa',
    example: 'fisica'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 850 },
        natureza: { type: 'string', example: 'fisica' }
      }
    }
  })
  async countByNatureza(@Param('natureza') natureza: string): Promise<{ total: number; natureza: string }> {
    const total = await this.pessoaService.countByNatureza(natureza);
    return { total, natureza };
  }
}
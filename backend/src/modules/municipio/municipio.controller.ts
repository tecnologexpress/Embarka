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
import { MunicipioService } from './municipio.service';
import { CreateMunicipioDto, UpdateMunicipioDto } from './dto/municipio.dto';
import { Municipio } from './municipio.entity';

/**
 * Controlador para gerenciamento de Municípios
 * @description Endpoints REST para operações CRUD de municípios brasileiros
 */
@ApiTags('Municípios')
@Controller('municipios')
export class MunicipioController {
  constructor(private readonly municipioService: MunicipioService) {}

  /**
   * Cria um novo município
   * @param createMunicipioDto - Dados do município a ser criado
   * @returns Município criado
   */
  @Post()
  @ApiOperation({ 
    summary: 'Criar município',
    description: 'Cria um novo município brasileiro no sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Município criado com sucesso',
    type: Municipio
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estado não encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Município com este código IBGE já existe'
  })
  async create(@Body() createMunicipioDto: CreateMunicipioDto): Promise<Municipio> {
    return this.municipioService.create(createMunicipioDto);
  }

  /**
   * Lista todos os municípios
   * @returns Lista de todos os municípios cadastrados
   */
  @Get()
  @ApiOperation({ 
    summary: 'Listar municípios',
    description: 'Retorna lista de todos os municípios brasileiros cadastrados'
  })
  @ApiQuery({
    name: 'estadoId',
    required: false,
    description: 'Filtrar por ID do estado',
    type: Number
  })
  @ApiQuery({
    name: 'uf',
    required: false,
    description: 'Filtrar por UF do estado',
    type: String
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de municípios retornada com sucesso',
    type: [Municipio]
  })
  async findAll(
    @Query('estadoId') estadoId?: number,
    @Query('uf') uf?: string,
  ): Promise<Municipio[]> {
    if (estadoId) {
      return this.municipioService.findByEstado(estadoId);
    }
    if (uf) {
      return this.municipioService.findByUf(uf);
    }
    return this.municipioService.findAll();
  }

  /**
   * Busca município por ID
   * @param id - ID do município
   * @returns Município encontrado
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar município por ID',
    description: 'Retorna um município específico pelo seu ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do município',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Município encontrado',
    type: Municipio
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Município não encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Municipio> {
    return this.municipioService.findOne(id);
  }

  /**
   * Busca município por código IBGE
   * @param codigoIbge - Código IBGE do município
   * @returns Município encontrado
   */
  @Get('ibge/:codigoIbge')
  @ApiOperation({ 
    summary: 'Buscar município por código IBGE',
    description: 'Retorna um município específico pelo seu código IBGE'
  })
  @ApiParam({ 
    name: 'codigoIbge', 
    description: 'Código IBGE do município',
    example: 3550308
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Município encontrado',
    type: Municipio
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Município não encontrado'
  })
  async findByCodigoIbge(@Param('codigoIbge', ParseIntPipe) codigoIbge: number): Promise<Municipio> {
    return this.municipioService.findByCodigoIbge(codigoIbge);
  }

  /**
   * Lista municípios por estado
   * @param estadoId - ID do estado
   * @returns Lista de municípios do estado
   */
  @Get('estado/:estadoId')
  @ApiOperation({ 
    summary: 'Listar municípios por estado',
    description: 'Retorna lista de municípios de um estado específico'
  })
  @ApiParam({ 
    name: 'estadoId', 
    description: 'ID do estado',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de municípios do estado',
    type: [Municipio]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estado não encontrado'
  })
  async findByEstado(@Param('estadoId', ParseIntPipe) estadoId: number): Promise<Municipio[]> {
    return this.municipioService.findByEstado(estadoId);
  }

  /**
   * Lista municípios por UF
   * @param uf - Sigla do estado
   * @returns Lista de municípios da UF
   */
  @Get('uf/:uf')
  @ApiOperation({ 
    summary: 'Listar municípios por UF',
    description: 'Retorna lista de municípios de uma UF específica'
  })
  @ApiParam({ 
    name: 'uf', 
    description: 'Sigla do estado',
    example: 'SP'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de municípios da UF',
    type: [Municipio]
  })
  async findByUf(@Param('uf') uf: string): Promise<Municipio[]> {
    return this.municipioService.findByUf(uf);
  }

  /**
   * Atualiza um município
   * @param id - ID do município
   * @param updateMunicipioDto - Dados para atualização
   * @returns Município atualizado
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar município',
    description: 'Atualiza os dados de um município existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do município',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Município atualizado com sucesso',
    type: Municipio
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
    description: 'Conflito com dados existentes'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMunicipioDto: UpdateMunicipioDto,
  ): Promise<Municipio> {
    return this.municipioService.update(id, updateMunicipioDto);
  }

  /**
   * Remove um município
   * @param id - ID do município
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remover município',
    description: 'Remove um município do sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do município',
    example: 1
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Município removido com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Município não encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Município possui pessoas vinculadas'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.municipioService.remove(id);
  }

  /**
   * Conta total de municípios
   * @returns Número total de municípios cadastrados
   */
  @Get('count/total')
  @ApiOperation({ 
    summary: 'Contar municípios',
    description: 'Retorna o número total de municípios cadastrados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 5570 }
      }
    }
  })
  async count(): Promise<{ total: number }> {
    const total = await this.municipioService.count();
    return { total };
  }

  /**
   * Conta municípios por estado
   * @param estadoId - ID do estado
   * @returns Número de municípios do estado
   */
  @Get('count/estado/:estadoId')
  @ApiOperation({ 
    summary: 'Contar municípios por estado',
    description: 'Retorna o número de municípios de um estado específico'
  })
  @ApiParam({ 
    name: 'estadoId', 
    description: 'ID do estado',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 645 },
        estadoId: { type: 'number', example: 1 }
      }
    }
  })
  async countByEstado(@Param('estadoId', ParseIntPipe) estadoId: number): Promise<{ total: number; estadoId: number }> {
    const total = await this.municipioService.countByEstado(estadoId);
    return { total, estadoId };
  }
}
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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EstadoService } from './estado.service';
import { CreateEstadoDto, UpdateEstadoDto } from './dto/estado.dto';
import { Estado } from './estado.entity';

/**
 * Controlador para gerenciamento de Estados
 * @description Endpoints REST para operações CRUD de estados brasileiros
 */
@ApiTags('Estados')
@Controller('estados')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  /**
   * Cria um novo estado
   * @param createEstadoDto - Dados do estado a ser criado
   * @returns Estado criado
   */
  @Post()
  @ApiOperation({ 
    summary: 'Criar estado',
    description: 'Cria um novo estado brasileiro no sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Estado criado com sucesso',
    type: Estado
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Estado com esta sigla já existe'
  })
  async create(@Body() createEstadoDto: CreateEstadoDto): Promise<Estado> {
    return this.estadoService.create(createEstadoDto);
  }

  /**
   * Lista todos os estados
   * @returns Lista de todos os estados cadastrados
   */
  @Get()
  @ApiOperation({ 
    summary: 'Listar estados',
    description: 'Retorna lista de todos os estados brasileiros cadastrados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de estados retornada com sucesso',
    type: [Estado]
  })
  async findAll(): Promise<Estado[]> {
    return this.estadoService.findAll();
  }

  /**
   * Busca estado por ID
   * @param id - ID do estado
   * @returns Estado encontrado
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar estado por ID',
    description: 'Retorna um estado específico pelo seu ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do estado',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado encontrado',
    type: Estado
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estado não encontrado'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Estado> {
    return this.estadoService.findOne(id);
  }

  /**
   * Busca estado por sigla
   * @param sigla - Sigla do estado (ex: SP, RJ)
   * @returns Estado encontrado
   */
  @Get('sigla/:sigla')
  @ApiOperation({ 
    summary: 'Buscar estado por sigla',
    description: 'Retorna um estado específico pela sua sigla'
  })
  @ApiParam({ 
    name: 'sigla', 
    description: 'Sigla do estado',
    example: 'SP'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado encontrado',
    type: Estado
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estado não encontrado'
  })
  async findBySigla(@Param('sigla') sigla: string): Promise<Estado> {
    return this.estadoService.findBySigla(sigla);
  }

  /**
   * Atualiza um estado
   * @param id - ID do estado
   * @param updateEstadoDto - Dados para atualização
   * @returns Estado atualizado
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar estado',
    description: 'Atualiza os dados de um estado existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do estado',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado atualizado com sucesso',
    type: Estado
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
    description: 'Conflito com dados existentes'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoDto: UpdateEstadoDto,
  ): Promise<Estado> {
    return this.estadoService.update(id, updateEstadoDto);
  }

  /**
   * Remove um estado
   * @param id - ID do estado
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remover estado',
    description: 'Remove um estado do sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do estado',
    example: 1
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Estado removido com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Estado não encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Estado possui municípios vinculados'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.estadoService.remove(id);
  }

  /**
   * Conta total de estados
   * @returns Número total de estados cadastrados
   */
  @Get('count/total')
  @ApiOperation({ 
    summary: 'Contar estados',
    description: 'Retorna o número total de estados cadastrados'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 27 }
      }
    }
  })
  async count(): Promise<{ total: number }> {
    const total = await this.estadoService.count();
    return { total };
  }
}
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
import { NaturezaJuridicaService } from './natureza-juridica.service';
import { CreateNaturezaJuridicaDto, UpdateNaturezaJuridicaDto } from './dto/natureza-juridica.dto';
import { NaturezaJuridica } from './natureza-juridica.entity';

/**
 * Controlador para gerenciamento de Naturezas Jurídicas
 * @description Endpoints REST para operações CRUD de naturezas jurídicas
 */
@ApiTags('Naturezas Jurídicas')
@Controller('naturezas-juridicas')
export class NaturezaJuridicaController {
  constructor(private readonly naturezaJuridicaService: NaturezaJuridicaService) {}

  /**
   * Cria uma nova natureza jurídica
   * @param createNaturezaJuridicaDto - Dados da natureza jurídica a ser criada
   * @returns Natureza jurídica criada
   */
  @Post()
  @ApiOperation({ 
    summary: 'Criar natureza jurídica',
    description: 'Cria uma nova natureza jurídica no sistema'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Natureza jurídica criada com sucesso',
    type: NaturezaJuridica
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Natureza jurídica com este código já existe'
  })
  async create(@Body() createNaturezaJuridicaDto: CreateNaturezaJuridicaDto): Promise<NaturezaJuridica> {
    return this.naturezaJuridicaService.create(createNaturezaJuridicaDto);
  }

  /**
   * Lista todas as naturezas jurídicas
   * @returns Lista de naturezas jurídicas
   */
  @Get()
  @ApiOperation({ 
    summary: 'Listar naturezas jurídicas',
    description: 'Retorna uma lista de todas as naturezas jurídicas ativas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de naturezas jurídicas retornada com sucesso',
    type: [NaturezaJuridica]
  })
  async findAll(): Promise<NaturezaJuridica[]> {
    return this.naturezaJuridicaService.findAll();
  }

  /**
   * Busca uma natureza jurídica por ID
   * @param id - ID da natureza jurídica
   * @returns Natureza jurídica encontrada
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar natureza jurídica por ID',
    description: 'Retorna uma natureza jurídica específica pelo seu ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da natureza jurídica',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Natureza jurídica encontrada',
    type: NaturezaJuridica
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Natureza jurídica não encontrada'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<NaturezaJuridica> {
    return this.naturezaJuridicaService.findOne(id);
  }

  /**
   * Busca uma natureza jurídica por código
   * @param codigo - Código da natureza jurídica
   * @returns Natureza jurídica encontrada
   */
  @Get('codigo/:codigo')
  @ApiOperation({ 
    summary: 'Buscar natureza jurídica por código',
    description: 'Retorna uma natureza jurídica específica pelo seu código (F ou J)'
  })
  @ApiParam({ 
    name: 'codigo', 
    description: 'Código da natureza jurídica',
    example: 'F'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Natureza jurídica encontrada',
    type: NaturezaJuridica
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Natureza jurídica não encontrada'
  })
  async findByCodigo(@Param('codigo') codigo: string): Promise<NaturezaJuridica> {
    return this.naturezaJuridicaService.findByCodigo(codigo);
  }

  /**
   * Atualiza uma natureza jurídica
   * @param id - ID da natureza jurídica
   * @param updateNaturezaJuridicaDto - Dados a serem atualizados
   * @returns Natureza jurídica atualizada
   */
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar natureza jurídica',
    description: 'Atualiza os dados de uma natureza jurídica existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da natureza jurídica',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Natureza jurídica atualizada com sucesso',
    type: NaturezaJuridica
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos fornecidos'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Natureza jurídica não encontrada'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Código já existe em outra natureza jurídica'
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNaturezaJuridicaDto: UpdateNaturezaJuridicaDto,
  ): Promise<NaturezaJuridica> {
    return this.naturezaJuridicaService.update(id, updateNaturezaJuridicaDto);
  }

  /**
   * Remove uma natureza jurídica
   * @param id - ID da natureza jurídica
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remover natureza jurídica',
    description: 'Remove uma natureza jurídica do sistema (soft delete)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID da natureza jurídica',
    example: 1
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Natureza jurídica removida com sucesso'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Natureza jurídica não encontrada'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Natureza jurídica possui pessoas vinculadas'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.naturezaJuridicaService.remove(id);
  }

  /**
   * Conta o total de naturezas jurídicas
   * @returns Objeto com o total de naturezas jurídicas
   */
  @Get('count/total')
  @ApiOperation({ 
    summary: 'Contar naturezas jurídicas',
    description: 'Retorna o número total de naturezas jurídicas ativas'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contagem retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 2
        }
      }
    }
  })
  async count(): Promise<{ total: number }> {
    const total = await this.naturezaJuridicaService.count();
    return { total };
  }

  /**
   * Inicializa as naturezas jurídicas padrão
   * @returns Mensagem de sucesso
   */
  @Post('initialize')
  @ApiOperation({ 
    summary: 'Inicializar naturezas padrão',
    description: 'Cria as naturezas jurídicas padrão (Física e Jurídica) se não existirem'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Naturezas padrão inicializadas com sucesso'
  })
  async initializeDefault(): Promise<{ message: string }> {
    await this.naturezaJuridicaService.initializeDefaultNaturezas();
    return { message: 'Naturezas jurídicas padrão inicializadas com sucesso' };
  }
}
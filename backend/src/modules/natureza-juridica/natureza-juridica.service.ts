import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NaturezaJuridica } from './natureza-juridica.entity';
import { CreateNaturezaJuridicaDto, UpdateNaturezaJuridicaDto } from './dto/natureza-juridica.dto';

/**
 * Service responsável pela lógica de negócio das Naturezas Jurídicas
 * @description Gerencia operações CRUD e regras de negócio para naturezas jurídicas
 */
@Injectable()
export class NaturezaJuridicaService {
  constructor(
    @InjectRepository(NaturezaJuridica)
    private readonly naturezaJuridicaRepository: Repository<NaturezaJuridica>,
  ) {}

  /**
   * Cria uma nova natureza jurídica
   * @param createNaturezaJuridicaDto - Dados da natureza jurídica a ser criada
   * @returns A natureza jurídica criada
   * @throws ConflictException quando código já existe
   * @example
   * ```typescript
   * const natureza = await service.create({
   *   descricao: 'Pessoa Física',
   *   codigo: 'F'
   * });
   * ```
   */
  async create(createNaturezaJuridicaDto: CreateNaturezaJuridicaDto): Promise<NaturezaJuridica> {
    // Verifica se já existe natureza com o mesmo código
    const existingNatureza = await this.naturezaJuridicaRepository.findOne({
      where: { codigo: createNaturezaJuridicaDto.codigo }
    });

    if (existingNatureza) {
      throw new ConflictException(`Natureza jurídica com código '${createNaturezaJuridicaDto.codigo}' já existe`);
    }

    const natureza = this.naturezaJuridicaRepository.create(createNaturezaJuridicaDto);
    return await this.naturezaJuridicaRepository.save(natureza);
  }

  /**
   * Busca todas as naturezas jurídicas
   * @returns Lista de todas as naturezas jurídicas ativas
   * @example
   * ```typescript
   * const naturezas = await service.findAll();
   * ```
   */
  async findAll(): Promise<NaturezaJuridica[]> {
    return await this.naturezaJuridicaRepository.find({
      where: { ativa: true },
      order: { descricao: 'ASC' }
    });
  }

  /**
   * Busca uma natureza jurídica por ID
   * @param id - ID da natureza jurídica
   * @returns A natureza jurídica encontrada
   * @throws NotFoundException quando natureza não encontrada
   * @example
   * ```typescript
   * const natureza = await service.findOne(1);
   * ```
   */
  async findOne(id: number): Promise<NaturezaJuridica> {
    const natureza = await this.naturezaJuridicaRepository.findOne({
      where: { id }
    });

    if (!natureza) {
      throw new NotFoundException(`Natureza jurídica com ID ${id} não encontrada`);
    }

    return natureza;
  }

  /**
   * Busca uma natureza jurídica por código
   * @param codigo - Código da natureza jurídica (F ou J)
   * @returns A natureza jurídica encontrada
   * @throws NotFoundException quando natureza não encontrada
   * @example
   * ```typescript
   * const natureza = await service.findByCodigo('F');
   * ```
   */
  async findByCodigo(codigo: string): Promise<NaturezaJuridica> {
    const natureza = await this.naturezaJuridicaRepository.findOne({
      where: { codigo: codigo.toUpperCase(), ativa: true }
    });

    if (!natureza) {
      throw new NotFoundException(`Natureza jurídica com código '${codigo}' não encontrada`);
    }

    return natureza;
  }

  /**
   * Atualiza uma natureza jurídica
   * @param id - ID da natureza jurídica
   * @param updateNaturezaJuridicaDto - Dados a serem atualizados
   * @returns A natureza jurídica atualizada
   * @throws NotFoundException quando natureza não encontrada
   * @throws ConflictException quando código já existe em outra natureza
   * @example
   * ```typescript
   * const natureza = await service.update(1, { descricao: 'Pessoa Física Atualizada' });
   * ```
   */
  async update(id: number, updateNaturezaJuridicaDto: UpdateNaturezaJuridicaDto): Promise<NaturezaJuridica> {
    const natureza = await this.findOne(id);

    // Se está alterando o código, verifica se não existe outro com o mesmo código
    if (updateNaturezaJuridicaDto.codigo && updateNaturezaJuridicaDto.codigo !== natureza.codigo) {
      const existingNatureza = await this.naturezaJuridicaRepository.findOne({
        where: { codigo: updateNaturezaJuridicaDto.codigo }
      });

      if (existingNatureza) {
        throw new ConflictException(`Natureza jurídica com código '${updateNaturezaJuridicaDto.codigo}' já existe`);
      }
    }

    Object.assign(natureza, updateNaturezaJuridicaDto);
    return await this.naturezaJuridicaRepository.save(natureza);
  }

  /**
   * Remove uma natureza jurídica (soft delete)
   * @param id - ID da natureza jurídica
   * @throws NotFoundException quando natureza não encontrada
   * @throws ConflictException quando natureza possui pessoas vinculadas
   * @example
   * ```typescript
   * await service.remove(1);
   * ```
   */
  async remove(id: number): Promise<void> {
    const natureza = await this.naturezaJuridicaRepository.findOne({
      where: { id },
      relations: ['pessoasNatureza']
    });

    if (!natureza) {
      throw new NotFoundException(`Natureza jurídica com ID ${id} não encontrada`);
    }

    if (natureza.pessoasNatureza && natureza.pessoasNatureza.length > 0) {
      throw new ConflictException(
        `Não é possível excluir a natureza jurídica '${natureza.descricao}' pois possui ${natureza.pessoasNatureza.length} pessoa(s) vinculada(s)`
      );
    }

    // Soft delete - marca como inativa
    natureza.ativa = false;
    await this.naturezaJuridicaRepository.save(natureza);
  }

  /**
   * Conta o total de naturezas jurídicas ativas
   * @returns Número total de naturezas jurídicas ativas
   * @example
   * ```typescript
   * const total = await service.count();
   * ```
   */
  async count(): Promise<number> {
    return await this.naturezaJuridicaRepository.count({
      where: { ativa: true }
    });
  }

  /**
   * Inicializa as naturezas jurídicas padrão (Física e Jurídica)
   * @description Método para criar as naturezas básicas se não existirem
   * @example
   * ```typescript
   * await service.initializeDefaultNaturezas();
   * ```
   */
  async initializeDefaultNaturezas(): Promise<void> {
    const naturezas = [
      { codigo: 'F', descricao: 'Pessoa Física' },
      { codigo: 'J', descricao: 'Pessoa Jurídica' }
    ];

    for (const natureza of naturezas) {
      const existing = await this.naturezaJuridicaRepository.findOne({
        where: { codigo: natureza.codigo }
      });

      if (!existing) {
        const newNatureza = this.naturezaJuridicaRepository.create(natureza);
        await this.naturezaJuridicaRepository.save(newNatureza);
      }
    }
  }
}
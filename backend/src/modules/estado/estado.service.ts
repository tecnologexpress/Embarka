import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './estado.entity';
import { CreateEstadoDto, UpdateEstadoDto } from './dto/estado.dto';

/**
 * Serviço para gerenciamento de Estados
 * @description Contém toda a lógica de negócio relacionada aos estados brasileiros
 */
@Injectable()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  /**
   * Cria um novo estado
   * @param createEstadoDto - Dados para criação do estado
   * @returns Promise<Estado> - Estado criado
   * @throws ConflictException - Se já existe estado com a mesma sigla
   */
  async create(createEstadoDto: CreateEstadoDto): Promise<Estado> {
    // Verifica se já existe estado com a mesma sigla
    const existingEstado = await this.estadoRepository.findOne({
      where: { sigla: createEstadoDto.sigla }
    });

    if (existingEstado) {
      throw new ConflictException(`Estado com sigla '${createEstadoDto.sigla}' já existe`);
    }

    const estado = this.estadoRepository.create(createEstadoDto);
    return this.estadoRepository.save(estado);
  }

  /**
   * Busca todos os estados
   * @returns Promise<Estado[]> - Lista de todos os estados
   */
  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.find({
      relations: ['municipios'],
      order: { nome: 'ASC' }
    });
  }

  /**
   * Busca estado por ID
   * @param id - ID do estado
   * @returns Promise<Estado> - Estado encontrado
   * @throws NotFoundException - Se estado não for encontrado
   */
  async findOne(id: number): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({
      where: { id },
      relations: ['municipios']
    });

    if (!estado) {
      throw new NotFoundException(`Estado com ID ${id} não encontrado`);
    }

    return estado;
  }

  /**
   * Busca estado por sigla
   * @param sigla - Sigla do estado (ex: 'SP', 'RJ')
   * @returns Promise<Estado> - Estado encontrado
   * @throws NotFoundException - Se estado não for encontrado
   */
  async findBySigla(sigla: string): Promise<Estado> {
    const estado = await this.estadoRepository.findOne({
      where: { sigla: sigla.toUpperCase() },
      relations: ['municipios']
    });

    if (!estado) {
      throw new NotFoundException(`Estado com sigla '${sigla}' não encontrado`);
    }

    return estado;
  }

  /**
   * Atualiza um estado
   * @param id - ID do estado
   * @param updateEstadoDto - Dados para atualização
   * @returns Promise<Estado> - Estado atualizado
   * @throws NotFoundException - Se estado não for encontrado
   * @throws ConflictException - Se tentar alterar para sigla já existente
   */
  async update(id: number, updateEstadoDto: UpdateEstadoDto): Promise<Estado> {
    const estado = await this.findOne(id);

    // Se está alterando a sigla, verifica se não existe outra igual
    if (updateEstadoDto.sigla && updateEstadoDto.sigla !== estado.sigla) {
      const existingEstado = await this.estadoRepository.findOne({
        where: { sigla: updateEstadoDto.sigla }
      });

      if (existingEstado) {
        throw new ConflictException(`Estado com sigla '${updateEstadoDto.sigla}' já existe`);
      }
    }

    Object.assign(estado, updateEstadoDto);
    return this.estadoRepository.save(estado);
  }

  /**
   * Remove um estado
   * @param id - ID do estado
   * @throws NotFoundException - Se estado não for encontrado
   * @throws ConflictException - Se estado possui municípios vinculados
   */
  async remove(id: number): Promise<void> {
    const estado = await this.estadoRepository.findOne({
      where: { id },
      relations: ['municipios']
    });

    if (!estado) {
      throw new NotFoundException(`Estado com ID ${id} não encontrado`);
    }

    if (estado.municipios && estado.municipios.length > 0) {
      throw new ConflictException(
        `Não é possível excluir o estado '${estado.nome}' pois possui ${estado.municipios.length} município(s) vinculado(s)`
      );
    }

    await this.estadoRepository.remove(estado);
  }

  /**
   * Conta total de estados cadastrados
   * @returns Promise<number> - Número total de estados
   */
  async count(): Promise<number> {
    return this.estadoRepository.count();
  }
}
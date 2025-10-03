import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from './municipio.entity';
import { Estado } from '../estado/estado.entity';
import { CreateMunicipioDto, UpdateMunicipioDto } from './dto/municipio.dto';

/**
 * Serviço para gerenciamento de Municípios
 * @description Contém toda a lógica de negócio relacionada aos municípios brasileiros
 */
@Injectable()
export class MunicipioService {
  constructor(
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
    @InjectRepository(Estado)
    private readonly estadoRepository: Repository<Estado>,
  ) {}

  /**
   * Cria um novo município
   * @param createMunicipioDto - Dados para criação do município
   * @returns Promise<Municipio> - Município criado
   * @throws NotFoundException - Se estado não for encontrado
   * @throws ConflictException - Se já existe município com mesmo código IBGE
   */
  async create(createMunicipioDto: CreateMunicipioDto): Promise<Municipio> {
    // Verifica se o estado existe
    const estado = await this.estadoRepository.findOne({
      where: { id: createMunicipioDto.estadoId }
    });

    if (!estado) {
      throw new NotFoundException(`Estado com ID ${createMunicipioDto.estadoId} não encontrado`);
    }

    // Verifica se já existe município com mesmo código IBGE
    if (createMunicipioDto.codigoIbge) {
      const existingMunicipio = await this.municipioRepository.findOne({
        where: { codigoIbge: createMunicipioDto.codigoIbge }
      });

      if (existingMunicipio) {
        throw new ConflictException(`Município com código IBGE ${createMunicipioDto.codigoIbge} já existe`);
      }
    }

    const municipio = this.municipioRepository.create({
      ...createMunicipioDto,
      estado
    });

    return this.municipioRepository.save(municipio);
  }

  /**
   * Busca todos os municípios
   * @returns Promise<Municipio[]> - Lista de todos os municípios
   */
  async findAll(): Promise<Municipio[]> {
    return this.municipioRepository.find({
      relations: ['estado', 'pessoas'],
      order: { nome: 'ASC' }
    });
  }

  /**
   * Busca município por ID
   * @param id - ID do município
   * @returns Promise<Municipio> - Município encontrado
   * @throws NotFoundException - Se município não for encontrado
   */
  async findOne(id: number): Promise<Municipio> {
    const municipio = await this.municipioRepository.findOne({
      where: { id },
      relations: ['estado', 'pessoas']
    });

    if (!municipio) {
      throw new NotFoundException(`Município com ID ${id} não encontrado`);
    }

    return municipio;
  }

  /**
   * Busca município por código IBGE
   * @param codigoIbge - Código IBGE do município
   * @returns Promise<Municipio> - Município encontrado
   * @throws NotFoundException - Se município não for encontrado
   */
  async findByCodigoIbge(codigoIbge: number): Promise<Municipio> {
    const municipio = await this.municipioRepository.findOne({
      where: { codigoIbge },
      relations: ['estado', 'pessoas']
    });

    if (!municipio) {
      throw new NotFoundException(`Município com código IBGE ${codigoIbge} não encontrado`);
    }

    return municipio;
  }

  /**
   * Busca municípios por estado
   * @param estadoId - ID do estado
   * @returns Promise<Municipio[]> - Lista de municípios do estado
   * @throws NotFoundException - Se estado não for encontrado
   */
  async findByEstado(estadoId: number): Promise<Municipio[]> {
    const estado = await this.estadoRepository.findOne({
      where: { id: estadoId }
    });

    if (!estado) {
      throw new NotFoundException(`Estado com ID ${estadoId} não encontrado`);
    }

    return this.municipioRepository.find({
      where: { estado: { id: estadoId } },
      relations: ['estado'],
      order: { nome: 'ASC' }
    });
  }

  /**
   * Busca municípios por UF
   * @param uf - Sigla do estado
   * @returns Promise<Municipio[]> - Lista de municípios da UF
   */
  async findByUf(uf: string): Promise<Municipio[]> {
    return this.municipioRepository.find({
      where: { uf: uf.toUpperCase() },
      relations: ['estado'],
      order: { nome: 'ASC' }
    });
  }

  /**
   * Atualiza um município
   * @param id - ID do município
   * @param updateMunicipioDto - Dados para atualização
   * @returns Promise<Municipio> - Município atualizado
   * @throws NotFoundException - Se município ou estado não for encontrado
   * @throws ConflictException - Se tentar alterar para código IBGE já existente
   */
  async update(id: number, updateMunicipioDto: UpdateMunicipioDto): Promise<Municipio> {
    const municipio = await this.findOne(id);

    // Se está alterando o estado, verifica se existe
    if (updateMunicipioDto.estadoId && updateMunicipioDto.estadoId !== municipio.estado.id) {
      const estado = await this.estadoRepository.findOne({
        where: { id: updateMunicipioDto.estadoId }
      });

      if (!estado) {
        throw new NotFoundException(`Estado com ID ${updateMunicipioDto.estadoId} não encontrado`);
      }

      municipio.estado = estado;
    }

    // Se está alterando código IBGE, verifica se não existe outro igual
    if (updateMunicipioDto.codigoIbge && updateMunicipioDto.codigoIbge !== municipio.codigoIbge) {
      const existingMunicipio = await this.municipioRepository.findOne({
        where: { codigoIbge: updateMunicipioDto.codigoIbge }
      });

      if (existingMunicipio) {
        throw new ConflictException(`Município com código IBGE ${updateMunicipioDto.codigoIbge} já existe`);
      }
    }

    Object.assign(municipio, updateMunicipioDto);
    return this.municipioRepository.save(municipio);
  }

  /**
   * Remove um município
   * @param id - ID do município
   * @throws NotFoundException - Se município não for encontrado
   * @throws ConflictException - Se município possui pessoas vinculadas
   */
  async remove(id: number): Promise<void> {
    const municipio = await this.municipioRepository.findOne({
      where: { id },
      relations: ['pessoas']
    });

    if (!municipio) {
      throw new NotFoundException(`Município com ID ${id} não encontrado`);
    }

    if (municipio.pessoas && municipio.pessoas.length > 0) {
      throw new ConflictException(
        `Não é possível excluir o município '${municipio.nome}' pois possui ${municipio.pessoas.length} pessoa(s) vinculada(s)`
      );
    }

    await this.municipioRepository.remove(municipio);
  }

  /**
   * Conta total de municípios cadastrados
   * @returns Promise<number> - Número total de municípios
   */
  async count(): Promise<number> {
    return this.municipioRepository.count();
  }

  /**
   * Conta municípios por estado
   * @param estadoId - ID do estado
   * @returns Promise<number> - Número de municípios do estado
   */
  async countByEstado(estadoId: number): Promise<number> {
    return this.municipioRepository.count({
      where: { estado: { id: estadoId } }
    });
  }
}
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './pessoa.entity';
import { PessoaNaturezaJuridica } from '../pessoa-natureza/pessoa-natureza.entity';
import { NaturezaJuridica } from '../natureza-juridica/natureza-juridica.entity';
import { Municipio } from '../municipio/municipio.entity';
import { CreatePessoaDto, UpdatePessoaDto } from './dto/pessoa.dto';
import { isValidCPF, isValidCNPJ } from '../../common/utils/document-validator.util';

/**
 * Serviço para gerenciamento de Pessoas
 * @description Contém toda a lógica de negócio relacionada às pessoas físicas e jurídicas
 */
@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    @InjectRepository(PessoaNaturezaJuridica)
    private readonly pessoaNaturezaJuridicaRepository: Repository<PessoaNaturezaJuridica>,
    @InjectRepository(NaturezaJuridica)
    private readonly naturezaJuridicaRepository: Repository<NaturezaJuridica>,
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
  ) {}

  /**
   * Cria uma nova pessoa
   * @param createPessoaDto - Dados para criação da pessoa
   * @returns Promise<Pessoa> - Pessoa criada
   * @throws ConflictException - Se já existe pessoa com mesmo documento ou email
   * @throws NotFoundException - Se município não for encontrado
   * @throws BadRequestException - Se documento for inválido
   */
  async create(createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
    // Valida o documento CPF/CNPJ
    const documento = createPessoaDto.documento.replace(/[^\w]/g, ''); // Remove caracteres especiais
    let isDocumentoValido = false;
    let naturezaCodigo = '';

    if (documento.length === 11) {
      isDocumentoValido = isValidCPF(documento);
      naturezaCodigo = 'F'; // Pessoa Física
    } else if (documento.length === 14) {
      isDocumentoValido = isValidCNPJ(documento);
      naturezaCodigo = 'J'; // Pessoa Jurídica
    }

    if (!isDocumentoValido) {
      throw new BadRequestException('Documento CPF/CNPJ inválido');
    }

    // Verifica se já existe pessoa com mesmo documento
    const existingPessoaByDoc = await this.pessoaRepository.findOne({
      where: { documento: createPessoaDto.documento }
    });

    if (existingPessoaByDoc) {
      throw new ConflictException(`Pessoa com documento '${createPessoaDto.documento}' já existe`);
    }

    // Verifica se já existe pessoa com mesmo email
    const existingPessoaByEmail = await this.pessoaRepository.findOne({
      where: { email: createPessoaDto.email }
    });

    if (existingPessoaByEmail) {
      throw new ConflictException(`Pessoa com email '${createPessoaDto.email}' já existe`);
    }

    // Verifica se o município existe (se foi informado)
    let municipio: Municipio | undefined;
    if (createPessoaDto.codigoIbge) {
      municipio = await this.municipioRepository.findOne({
        where: { codigoIbge: createPessoaDto.codigoIbge }
      });

      if (!municipio) {
        throw new NotFoundException(`Município com código IBGE ${createPessoaDto.codigoIbge} não encontrado`);
      }
    }

    // Busca a natureza jurídica baseada no documento
    const naturezaJuridica = await this.naturezaJuridicaRepository.findOne({
      where: { codigo: naturezaCodigo, ativa: true }
    });

    if (!naturezaJuridica) {
      throw new NotFoundException(`Natureza jurídica '${naturezaCodigo}' não encontrada`);
    }

    // Cria a pessoa
    const pessoaData: Partial<Pessoa> = {
      documento: createPessoaDto.documento,
      email: createPessoaDto.email,
      descricao: createPessoaDto.descricao,
      tratamento: createPessoaDto.tratamento,
      origem: createPessoaDto.origem,
      telefone: createPessoaDto.telefone,
      celular: createPessoaDto.celular,
      pais: createPessoaDto.pais,
      estado: createPessoaDto.estado,
      codigoIbge: createPessoaDto.codigoIbge,
      bairro: createPessoaDto.bairro,
      cep: createPessoaDto.cep,
      endereco: createPessoaDto.endereco,
      numero: createPessoaDto.numero,
      complemento: createPessoaDto.complemento,
      site: createPessoaDto.site,
      instagram: createPessoaDto.instagram,
      linkedin: createPessoaDto.linkedin,
      twitter: createPessoaDto.twitter,
      facebook: createPessoaDto.facebook,
      inscricaoEstadual: createPessoaDto.inscricaoEstadual,
      municipio
    };
    
    const pessoa = this.pessoaRepository.create(pessoaData);
    const pessoaSalva = await this.pessoaRepository.save(pessoa);

    // Cria a relação pessoa-natureza jurídica
    const pessoaNaturezaJuridica = this.pessoaNaturezaJuridicaRepository.create({
      pessoa: pessoaSalva,
      naturezaJuridica: naturezaJuridica
    });

    await this.pessoaNaturezaJuridicaRepository.save(pessoaNaturezaJuridica);

    return this.findOne(pessoaSalva.id);
  }

  /**
   * Busca todas as pessoas
   * @returns Promise<Pessoa[]> - Lista de todas as pessoas
   */
  async findAll(): Promise<Pessoa[]> {
    return this.pessoaRepository.find({
      relations: ['municipio', 'municipio.estado', 'naturezas', 'naturezas.naturezaJuridica'],
      order: { id: 'ASC' }
    });
  }

  /**
   * Busca pessoa por ID
   * @param id - ID da pessoa
   * @returns Promise<Pessoa> - Pessoa encontrada
   * @throws NotFoundException - Se pessoa não for encontrada
   */
  async findOne(id: number): Promise<Pessoa> {
    const pessoa = await this.pessoaRepository.findOne({
      where: { id },
      relations: ['municipio', 'municipio.estado', 'naturezas', 'naturezas.naturezaJuridica']
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return pessoa;
  }

  /**
   * Busca pessoa por documento
   * @param documento - Documento da pessoa (CPF/CNPJ)
   * @returns Promise<Pessoa> - Pessoa encontrada
   * @throws NotFoundException - Se pessoa não for encontrada
   */
  async findByDocumento(documento: string): Promise<Pessoa> {
    const pessoa = await this.pessoaRepository.findOne({
      where: { documento },
      relations: ['municipio', 'municipio.estado', 'naturezas', 'naturezas.naturezaJuridica']
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com documento '${documento}' não encontrada`);
    }

    return pessoa;
  }

  /**
   * Busca pessoa por email
   * @param email - Email da pessoa
   * @returns Promise<Pessoa> - Pessoa encontrada
   * @throws NotFoundException - Se pessoa não for encontrada
   */
  async findByEmail(email: string): Promise<Pessoa> {
    const pessoa = await this.pessoaRepository.findOne({
      where: { email },
      relations: ['municipio', 'municipio.estado', 'naturezas', 'naturezas.naturezaJuridica']
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com email '${email}' não encontrada`);
    }

    return pessoa;
  }

  /**
   * Busca pessoas por município
   * @param municipioId - ID do município
   * @returns Promise<Pessoa[]> - Lista de pessoas do município
   * @throws NotFoundException - Se município não for encontrado
   */
  async findByMunicipio(municipioId: number): Promise<Pessoa[]> {
    const municipio = await this.municipioRepository.findOne({
      where: { id: municipioId }
    });

    if (!municipio) {
      throw new NotFoundException(`Município com ID ${municipioId} não encontrado`);
    }

    return this.pessoaRepository.find({
      where: { municipio: { id: municipioId } },
      relations: ['municipio', 'municipio.estado', 'naturezas', 'naturezas.naturezaJuridica'],
      order: { id: 'ASC' }
    });
  }

  /**
   * Busca pessoas por natureza
   * @param natureza - Código da natureza (F/J)
   * @returns Promise<Pessoa[]> - Lista de pessoas da natureza especificada
   */
  async findByNatureza(natureza: string): Promise<Pessoa[]> {
    const naturezaJuridica = await this.naturezaJuridicaRepository.findOne({
      where: { codigo: natureza.toUpperCase(), ativa: true }
    });

    if (!naturezaJuridica) {
      return [];
    }

    const pessoasNatureza = await this.pessoaNaturezaJuridicaRepository.find({
      where: { naturezaJuridica: { id: naturezaJuridica.id } },
      relations: ['pessoa', 'pessoa.municipio', 'pessoa.municipio.estado']
    });

    return pessoasNatureza.map(pn => pn.pessoa);
  }

  /**
   * Atualiza uma pessoa
   * @param id - ID da pessoa
   * @param updatePessoaDto - Dados para atualização
   * @returns Promise<Pessoa> - Pessoa atualizada
   * @throws NotFoundException - Se pessoa ou município não for encontrado
   * @throws ConflictException - Se tentar alterar para documento/email já existente
   */
  async update(id: number, updatePessoaDto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOne(id);

    // Verifica se está alterando documento e se não existe outro igual
    if (updatePessoaDto.documento && updatePessoaDto.documento !== pessoa.documento) {
      const existingPessoa = await this.pessoaRepository.findOne({
        where: { documento: updatePessoaDto.documento }
      });

      if (existingPessoa) {
        throw new ConflictException(`Pessoa com documento '${updatePessoaDto.documento}' já existe`);
      }
    }

    // Verifica se está alterando email e se não existe outro igual
    if (updatePessoaDto.email && updatePessoaDto.email !== pessoa.email) {
      const existingPessoa = await this.pessoaRepository.findOne({
        where: { email: updatePessoaDto.email }
      });

      if (existingPessoa) {
        throw new ConflictException(`Pessoa com email '${updatePessoaDto.email}' já existe`);
      }
    }

    // Se está alterando o município, verifica se existe
    if (updatePessoaDto.codigoIbge && updatePessoaDto.codigoIbge !== pessoa.codigoIbge) {
      const municipio = await this.municipioRepository.findOne({
        where: { codigoIbge: updatePessoaDto.codigoIbge }
      });

      if (!municipio) {
        throw new NotFoundException(`Município com código IBGE ${updatePessoaDto.codigoIbge} não encontrado`);
      }

      pessoa.municipio = municipio;
    }

    Object.assign(pessoa, updatePessoaDto);
    await this.pessoaRepository.save(pessoa);

    return this.findOne(id);
  }

  /**
   * Remove uma pessoa
   * @param id - ID da pessoa
   * @throws NotFoundException - Se pessoa não for encontrada
   */
  async remove(id: number): Promise<void> {
    const pessoa = await this.pessoaRepository.findOne({
      where: { id }
    });

    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    // Remove a pessoa (CASCADE remove as relações)
    await this.pessoaRepository.remove(pessoa);
  }

  /**
   * Conta total de pessoas cadastradas
   * @returns Promise<number> - Número total de pessoas
   */
  async count(): Promise<number> {
    return this.pessoaRepository.count();
  }

  /**
   * Conta pessoas por natureza
   * @param natureza - Código da natureza (F/J)
   * @returns Promise<number> - Número de pessoas da natureza especificada
   */
  async countByNatureza(natureza: string): Promise<number> {
    const naturezaJuridica = await this.naturezaJuridicaRepository.findOne({
      where: { codigo: natureza.toUpperCase(), ativa: true }
    });

    if (!naturezaJuridica) {
      return 0;
    }

    return this.pessoaNaturezaJuridicaRepository.count({
      where: { naturezaJuridica: { id: naturezaJuridica.id } }
    });
  }
}
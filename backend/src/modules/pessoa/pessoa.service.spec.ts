import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoaService } from './pessoa.service';
import { Pessoa } from './pessoa.entity';
import { PessoaNaturezaJuridica } from '../pessoa-natureza/pessoa-natureza.entity';
import { NaturezaJuridica } from '../natureza-juridica/natureza-juridica.entity';
import { Municipio } from '../municipio/municipio.entity';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

// Mock dos utilitários de validação
jest.mock('../../common/utils/document-validator.util', () => ({
  isValidCPF: jest.fn(),
  isValidCNPJ: jest.fn(),
}));

/**
 * Testes unitários para PessoaService
 * @description Testa toda a lógica de negócio relacionada às pessoas
 */
describe('PessoaService', () => {
  let service: PessoaService;

  // Mock do repositório Pessoa
  const mockPessoaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  // Mock do repositório PessoaNaturezaJuridica
  const mockPessoaNaturezaJuridicaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  };

  // Mock do repositório NaturezaJuridica
  const mockNaturezaJuridicaRepository = {
    findOne: jest.fn(),
  };

  // Mock do repositório Municipio
  const mockMunicipioRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaService,
        {
          provide: getRepositoryToken(Pessoa),
          useValue: mockPessoaRepository,
        },
        {
          provide: getRepositoryToken(PessoaNaturezaJuridica),
          useValue: mockPessoaNaturezaJuridicaRepository,
        },
        {
          provide: getRepositoryToken(NaturezaJuridica),
          useValue: mockNaturezaJuridicaRepository,
        },
        {
          provide: getRepositoryToken(Municipio),
          useValue: mockMunicipioRepository,
        },
      ],
    }).compile();

    service = module.get<PessoaService>(PessoaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPessoaDto = {
      documento: '12345678901', // CPF válido para teste
      email: 'joao@example.com',
      descricao: 'João Silva',
    };

    it('should create a pessoa successfully with valid CPF', async () => {
      const naturezaJuridica = { id: 1, codigo: 'F', descricao: 'Pessoa Física', ativa: true };
      const expectedPessoa = { id: 1, ...createPessoaDto };
      const pessoaNaturezaJuridica = { id: 1, pessoa: expectedPessoa, naturezaJuridica };

      // Mocks para documento válido
      const { isValidCPF } = require('../../common/utils/document-validator.util');
      isValidCPF.mockReturnValue(true);
      
      mockPessoaRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockNaturezaJuridicaRepository.findOne.mockResolvedValue(naturezaJuridica);
      mockPessoaRepository.create.mockReturnValue(expectedPessoa);
      mockPessoaRepository.save.mockResolvedValue(expectedPessoa);
      mockPessoaNaturezaJuridicaRepository.create.mockReturnValue(pessoaNaturezaJuridica);
      mockPessoaNaturezaJuridicaRepository.save.mockResolvedValue(pessoaNaturezaJuridica);

      // Mock do findOne que retorna pessoa completa
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedPessoa as any);

      const result = await service.create(createPessoaDto);

      expect(mockNaturezaJuridicaRepository.findOne).toHaveBeenCalledWith({
        where: { codigo: 'F', ativa: true }
      });
      expect(mockPessoaRepository.create).toHaveBeenCalled();
      expect(mockPessoaRepository.save).toHaveBeenCalled();
      expect(mockPessoaNaturezaJuridicaRepository.create).toHaveBeenCalled();
      expect(result).toEqual(expectedPessoa);
    });

    it('should throw BadRequestException when document is invalid', async () => {
      const invalidDto = { ...createPessoaDto, documento: '12345678000' };
      
      const { isValidCPF } = require('../../common/utils/document-validator.util');
      isValidCPF.mockReturnValue(false);

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when person with same CPF exists', async () => {
      const existingPessoa = { id: 1, documento: createPessoaDto.documento };
      
      const { isValidCPF } = require('../../common/utils/document-validator.util');
      isValidCPF.mockReturnValue(true);
      mockPessoaRepository.findOne.mockResolvedValue(existingPessoa);

      await expect(service.create(createPessoaDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all pessoas', async () => {
      const expectedPessoas = [
        { id: 1, documento: '12345678901', email: 'joao@example.com' },
        { id: 2, documento: '12345678000123', email: 'empresa@example.com' },
      ];

      mockPessoaRepository.find.mockResolvedValue(expectedPessoas);

      const result = await service.findAll();

      expect(mockPessoaRepository.find).toHaveBeenCalledWith({
        relations: ['municipio', 'municipio.estado', 'naturezas', 'naturezas.naturezaJuridica'],
        order: { id: 'ASC' }
      });
      expect(result).toEqual(expectedPessoas);
    });
  });

  describe('findOne', () => {
    it('should return pessoa when found', async () => {
      const expectedPessoa = { 
        id: 1, 
        documento: '12345678901', 
        email: 'joao@example.com',
        municipio: { id: 1, nome: 'São Paulo' },
        naturezas: []
      };

      mockPessoaRepository.findOne.mockResolvedValue(expectedPessoa);

      const result = await service.findOne(1);

      expect(mockPessoaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['municipio', 'municipio.estado', 'naturezas', 'naturezas.naturezaJuridica']
      });
      expect(result).toEqual(expectedPessoa);
    });

    it('should throw NotFoundException when pessoa not found', async () => {
      mockPessoaRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('count', () => {
    it('should return total count of pessoas', async () => {
      mockPessoaRepository.count.mockResolvedValue(5);

      const result = await service.count();

      expect(mockPessoaRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });
});
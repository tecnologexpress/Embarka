import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MunicipioService } from './municipio.service';
import { Municipio } from './municipio.entity';
import { Estado } from '../estado/estado.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

/**
 * Testes unitários para MunicipioService
 * @description Testa toda a lógica de negócio relacionada aos municípios
 */
describe('MunicipioService', () => {
  let service: MunicipioService;

  // Mock do repositório Municipio
  const mockMunicipioRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  // Mock do repositório Estado
  const mockEstadoRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MunicipioService,
        {
          provide: getRepositoryToken(Municipio),
          useValue: mockMunicipioRepository,
        },
        {
          provide: getRepositoryToken(Estado),
          useValue: mockEstadoRepository,
        },
      ],
    }).compile();

    service = module.get<MunicipioService>(MunicipioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createMunicipioDto = {
      nome: 'São Paulo',
      codigoIbge: 3550308,
      uf: 'SP',
      estadoId: 1,
    };

    it('should create a municipio successfully', async () => {
      const estado = { id: 1, nome: 'São Paulo', uf: 'SP' };
      const expectedMunicipio = { id: 1, ...createMunicipioDto, estado };

      mockEstadoRepository.findOne.mockResolvedValue(estado);
      mockMunicipioRepository.findOne.mockResolvedValue(null);
      mockMunicipioRepository.create.mockReturnValue(expectedMunicipio);
      mockMunicipioRepository.save.mockResolvedValue(expectedMunicipio);

      const result = await service.create(createMunicipioDto);

      expect(mockEstadoRepository.findOne).toHaveBeenCalledWith({
        where: { id: createMunicipioDto.estadoId }
      });
      expect(mockMunicipioRepository.create).toHaveBeenCalled();
      expect(mockMunicipioRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedMunicipio);
    });

    it('should throw ConflictException when municipio with same codigo IBGE exists', async () => {
      const estado = { id: 1, nome: 'São Paulo', uf: 'SP' };
      const existingMunicipio = { id: 1, codigoIbge: createMunicipioDto.codigoIbge };

      mockEstadoRepository.findOne.mockResolvedValue(estado);
      mockMunicipioRepository.findOne.mockResolvedValue(existingMunicipio);

      await expect(service.create(createMunicipioDto)).rejects.toThrow(ConflictException);

      expect(mockMunicipioRepository.create).not.toHaveBeenCalled();
      expect(mockMunicipioRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all municipios', async () => {
      const expectedMunicipios = [
        { 
          id: 1, 
          nome: 'São Paulo', 
          codigoIbge: 3550308,
          uf: 'SP',
          estado: { id: 1, nome: 'São Paulo', uf: 'SP' }
        },
      ];

      mockMunicipioRepository.find.mockResolvedValue(expectedMunicipios);

      const result = await service.findAll();

      expect(mockMunicipioRepository.find).toHaveBeenCalledWith({
        relations: ['estado', 'pessoas'],
        order: { nome: 'ASC' }
      });
      expect(result).toEqual(expectedMunicipios);
    });
  });

  describe('findOne', () => {
    it('should return municipio when found', async () => {
      const expectedMunicipio = { 
        id: 1, 
        nome: 'São Paulo', 
        codigoIbge: 3550308,
        uf: 'SP',
        estado: { id: 1, nome: 'São Paulo', uf: 'SP' }
      };

      mockMunicipioRepository.findOne.mockResolvedValue(expectedMunicipio);

      const result = await service.findOne(1);

      expect(mockMunicipioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['estado', 'pessoas']
      });
      expect(result).toEqual(expectedMunicipio);
    });

    it('should throw NotFoundException when municipio not found', async () => {
      mockMunicipioRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEstado', () => {
    it('should return municipios by estado', async () => {
      const expectedMunicipios = [
        { 
          id: 1, 
          nome: 'São Paulo', 
          codigoIbge: 3550308,
          uf: 'SP',
          estado: { id: 1, nome: 'São Paulo', uf: 'SP' }
        }
      ];

      mockMunicipioRepository.find.mockResolvedValue(expectedMunicipios);

      const result = await service.findByEstado(1);

      expect(mockMunicipioRepository.find).toHaveBeenCalledWith({
        where: { estado: { id: 1 } },
        relations: ['estado'],
        order: { nome: 'ASC' }
      });
      expect(result).toEqual(expectedMunicipios);
    });
  });

  describe('update', () => {
    it('should update municipio successfully', async () => {
      const updateDto = { nome: 'São Paulo Atualizado' };
      const existingMunicipio = { 
        id: 1, 
        nome: 'São Paulo', 
        codigoIbge: 3550308,
        uf: 'SP'
      };
      const updatedMunicipio = { ...existingMunicipio, ...updateDto };

      mockMunicipioRepository.findOne.mockResolvedValue(existingMunicipio);
      mockMunicipioRepository.save.mockResolvedValue(updatedMunicipio);
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedMunicipio as any);

      const result = await service.update(1, updateDto);

      expect(mockMunicipioRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedMunicipio);
    });
  });

  describe('remove', () => {
    it('should remove municipio when it has no pessoas', async () => {
      const municipio = { 
        id: 1, 
        nome: 'São Paulo', 
        codigoIbge: 3550308,
        uf: 'SP'
      };

      mockMunicipioRepository.findOne.mockResolvedValue(municipio);
      mockMunicipioRepository.remove.mockResolvedValue(municipio);

      await service.remove(1);

      expect(mockMunicipioRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pessoas']
      });
      expect(mockMunicipioRepository.remove).toHaveBeenCalledWith(municipio);
    });
  });

  describe('count', () => {
    it('should return total count of municipios', async () => {
      mockMunicipioRepository.count.mockResolvedValue(10);

      const result = await service.count();

      expect(mockMunicipioRepository.count).toHaveBeenCalled();
      expect(result).toBe(10);
    });
  });

  describe('countByEstado', () => {
    it('should return count of municipios by estado', async () => {
      mockMunicipioRepository.count.mockResolvedValue(5);

      const result = await service.countByEstado(1);

      expect(mockMunicipioRepository.count).toHaveBeenCalledWith({
        where: { estado: { id: 1 } }
      });
      expect(result).toBe(5);
    });
  });
});
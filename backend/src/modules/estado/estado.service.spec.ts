import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoService } from './estado.service';
import { Estado } from './estado.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

/**
 * Testes unitários para EstadoService
 * @description Testa toda a lógica de negócio relacionada aos estados
 */
describe('EstadoService', () => {
  let service: EstadoService;
  let repository: Repository<Estado>;

  // Mock do repositório
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstadoService,
        {
          provide: getRepositoryToken(Estado),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EstadoService>(EstadoService);
    repository = module.get<Repository<Estado>>(getRepositoryToken(Estado));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createEstadoDto = {
      nome: 'São Paulo',
      sigla: 'SP',
    };

    it('should create a estado successfully', async () => {
      const expectedEstado = { id: 1, ...createEstadoDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(expectedEstado);
      mockRepository.save.mockResolvedValue(expectedEstado);

      const result = await service.create(createEstadoDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { sigla: createEstadoDto.sigla }
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createEstadoDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedEstado);
      expect(result).toEqual(expectedEstado);
    });

    it('should throw ConflictException when estado with same sigla exists', async () => {
      const existingEstado = { id: 1, nome: 'São Paulo', sigla: 'SP' };
      mockRepository.findOne.mockResolvedValue(existingEstado);

      await expect(service.create(createEstadoDto)).rejects.toThrow(
        new ConflictException(`Estado com sigla '${createEstadoDto.sigla}' já existe`)
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { sigla: createEstadoDto.sigla }
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all estados', async () => {
      const expectedEstados = [
        { id: 1, nome: 'São Paulo', sigla: 'SP', municipios: [] },
        { id: 2, nome: 'Rio de Janeiro', sigla: 'RJ', municipios: [] },
      ];

      mockRepository.find.mockResolvedValue(expectedEstados);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['municipios'],
        order: { nome: 'ASC' }
      });
      expect(result).toEqual(expectedEstados);
    });
  });

  describe('findOne', () => {
    it('should return estado when found', async () => {
      const expectedEstado = { id: 1, nome: 'São Paulo', sigla: 'SP', municipios: [] };

      mockRepository.findOne.mockResolvedValue(expectedEstado);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['municipios']
      });
      expect(result).toEqual(expectedEstado);
    });

    it('should throw NotFoundException when estado not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Estado com ID 1 não encontrado')
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['municipios']
      });
    });
  });

  describe('findBySigla', () => {
    it('should return estado when found by sigla', async () => {
      const expectedEstado = { id: 1, nome: 'São Paulo', sigla: 'SP', municipios: [] };

      mockRepository.findOne.mockResolvedValue(expectedEstado);

      const result = await service.findBySigla('sp');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { sigla: 'SP' },
        relations: ['municipios']
      });
      expect(result).toEqual(expectedEstado);
    });

    it('should throw NotFoundException when estado not found by sigla', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findBySigla('XX')).rejects.toThrow(
        new NotFoundException('Estado com sigla \'XX\' não encontrado')
      );
    });
  });

  describe('update', () => {
    const updateEstadoDto = { nome: 'São Paulo Atualizado' };

    it('should update estado successfully', async () => {
      const existingEstado = { 
        id: 1, 
        nome: 'São Paulo', 
        sigla: 'SP', 
        municipios: [],
        criadoEm: new Date(),
        atualizadoEm: new Date()
      } as Estado;
      const updatedEstado = { ...existingEstado, ...updateEstadoDto };

      mockRepository.findOne.mockResolvedValue(existingEstado);
      mockRepository.save.mockResolvedValue(updatedEstado);

      // Mock do findOne usado dentro do update para buscar o estado
      jest.spyOn(service, 'findOne').mockResolvedValue(existingEstado);

      const result = await service.update(1, updateEstadoDto);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedEstado);
    });
  });

  describe('remove', () => {
    it('should remove estado when it has no municipios', async () => {
      const estado = { id: 1, nome: 'São Paulo', sigla: 'SP', municipios: [] };

      mockRepository.findOne.mockResolvedValue(estado);
      mockRepository.remove.mockResolvedValue(estado);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['municipios']
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(estado);
    });

    it('should throw ConflictException when estado has municipios', async () => {
      const estado = { 
        id: 1, 
        nome: 'São Paulo', 
        sigla: 'SP', 
        municipios: [{ id: 1, nome: 'São Paulo' }] 
      };

      mockRepository.findOne.mockResolvedValue(estado);

      await expect(service.remove(1)).rejects.toThrow(
        new ConflictException(
          'Não é possível excluir o estado \'São Paulo\' pois possui 1 município(s) vinculado(s)'
        )
      );

      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should return total count of estados', async () => {
      mockRepository.count.mockResolvedValue(27);

      const result = await service.count();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(result).toBe(27);
    });
  });
});
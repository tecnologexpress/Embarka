import { Test, TestingModule } from '@nestjs/testing';
import { EstadoController } from './estado.controller';
import { EstadoService } from './estado.service';
import { CreateEstadoDto, UpdateEstadoDto } from './dto/estado.dto';

/**
 * Testes unitários para EstadoController
 * @description Testa todos os endpoints REST do controlador de estados
 */
describe('EstadoController', () => {
  let controller: EstadoController;
  let service: EstadoService;

  // Mock do serviço
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySigla: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoController],
      providers: [
        {
          provide: EstadoService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EstadoController>(EstadoController);
    service = module.get<EstadoService>(EstadoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a estado', async () => {
      const createEstadoDto: CreateEstadoDto = {
        nome: 'São Paulo',
        sigla: 'SP',
      };

      const expectedEstado = {
        id: 1,
        ...createEstadoDto,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        municipios: [],
      };

      mockService.create.mockResolvedValue(expectedEstado);

      const result = await controller.create(createEstadoDto);

      expect(service.create).toHaveBeenCalledWith(createEstadoDto);
      expect(result).toEqual(expectedEstado);
    });
  });

  describe('findAll', () => {
    it('should return all estados', async () => {
      const expectedEstados = [
        {
          id: 1,
          nome: 'São Paulo',
          sigla: 'SP',
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          municipios: [],
        },
        {
          id: 2,
          nome: 'Rio de Janeiro',
          sigla: 'RJ',
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          municipios: [],
        },
      ];

      mockService.findAll.mockResolvedValue(expectedEstados);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedEstados);
    });
  });

  describe('findOne', () => {
    it('should return estado by id', async () => {
      const expectedEstado = {
        id: 1,
        nome: 'São Paulo',
        sigla: 'SP',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        municipios: [],
      };

      mockService.findOne.mockResolvedValue(expectedEstado);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedEstado);
    });
  });

  describe('findBySigla', () => {
    it('should return estado by sigla', async () => {
      const expectedEstado = {
        id: 1,
        nome: 'São Paulo',
        sigla: 'SP',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        municipios: [],
      };

      mockService.findBySigla.mockResolvedValue(expectedEstado);

      const result = await controller.findBySigla('sp');

      expect(service.findBySigla).toHaveBeenCalledWith('sp');
      expect(result).toEqual(expectedEstado);
    });
  });

  describe('update', () => {
    it('should update estado', async () => {
      const updateEstadoDto: UpdateEstadoDto = {
        nome: 'São Paulo Atualizado',
      };

      const expectedEstado = {
        id: 1,
        nome: 'São Paulo Atualizado',
        sigla: 'SP',
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        municipios: [],
      };

      mockService.update.mockResolvedValue(expectedEstado);

      const result = await controller.update(1, updateEstadoDto);

      expect(service.update).toHaveBeenCalledWith(1, updateEstadoDto);
      expect(result).toEqual(expectedEstado);
    });
  });

  describe('remove', () => {
    it('should remove estado', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('count', () => {
    it('should return count of estados', async () => {
      const expectedCount = { total: 27 };

      mockService.count.mockResolvedValue(27);

      const result = await controller.count();

      expect(service.count).toHaveBeenCalled();
      expect(result).toEqual(expectedCount);
    });
  });
});
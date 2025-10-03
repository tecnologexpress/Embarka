import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { Estado } from './estado.entity';

/**
 * Módulo do Estado
 * @description Módulo responsável pelo gerenciamento de estados brasileiros
 */
@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  controllers: [EstadoController],
  providers: [EstadoService],
  exports: [EstadoService, TypeOrmModule],
})
export class EstadoModule {}
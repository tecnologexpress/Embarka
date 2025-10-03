import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipioService } from './municipio.service';
import { MunicipioController } from './municipio.controller';
import { Municipio } from './municipio.entity';
import { EstadoModule } from '../estado/estado.module';

/**
 * Módulo do Município
 * @description Módulo responsável pelo gerenciamento de municípios brasileiros
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Municipio]),
    EstadoModule, // Importa para acessar o repositório do Estado
  ],
  controllers: [MunicipioController],
  providers: [MunicipioService],
  exports: [MunicipioService, TypeOrmModule],
})
export class MunicipioModule {}
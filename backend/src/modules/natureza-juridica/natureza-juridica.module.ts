import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NaturezaJuridica } from './natureza-juridica.entity';
import { NaturezaJuridicaService } from './natureza-juridica.service';
import { NaturezaJuridicaController } from './natureza-juridica.controller';

/**
 * Módulo da Natureza Jurídica
 * @description Módulo responsável pelo gerenciamento de naturezas jurídicas
 */
@Module({
  imports: [TypeOrmModule.forFeature([NaturezaJuridica])],
  controllers: [NaturezaJuridicaController],
  providers: [NaturezaJuridicaService],
  exports: [NaturezaJuridicaService],
})
export class NaturezaJuridicaModule {}
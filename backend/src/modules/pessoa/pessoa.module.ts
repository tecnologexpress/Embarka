import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';
import { Pessoa } from './pessoa.entity';
import { PessoaNaturezaJuridica } from '../pessoa-natureza/pessoa-natureza.entity';
import { NaturezaJuridica } from '../natureza-juridica/natureza-juridica.entity';
import { MunicipioModule } from '../municipio/municipio.module';

/**
 * Módulo da Pessoa
 * @description Módulo responsável pelo gerenciamento de pessoas físicas e jurídicas
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa, PessoaNaturezaJuridica, NaturezaJuridica]),
    MunicipioModule, // Importa para acessar o repositório do Município
  ],
  controllers: [PessoaController],
  providers: [PessoaService],
  exports: [PessoaService, TypeOrmModule],
})
export class PessoaModule {}
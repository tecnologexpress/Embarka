import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { EstadoModule } from './modules/estado/estado.module';
import { MunicipioModule } from './modules/municipio/municipio.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { NaturezaJuridicaModule } from './modules/natureza-juridica/natureza-juridica.module';

/**
 * Módulo principal da aplicação
 * @description Configura e organiza todos os módulos da aplicação
 */
@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.development', '.env'],
    }),
    
    // Configuração do banco de dados TypeORM
    TypeOrmModule.forRoot(databaseConfig),
    
    // Módulos de domínio
    EstadoModule,
    MunicipioModule,
    PessoaModule,
    NaturezaJuridicaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
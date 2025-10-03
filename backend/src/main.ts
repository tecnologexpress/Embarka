import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Função de inicialização da aplicação
 * @description Configura e inicia o servidor NestJS com validação e documentação
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração global de validação
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas nos DTOs
      forbidNonWhitelisted: true, // Retorna erro se propriedade não permitida for enviada
      transform: true, // Transforma tipos automaticamente
    }),
  );

  // Configuração do CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuração do Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('Embarka API')
    .setDescription('API para gerenciamento de Estados, Municípios e Pessoas - Clean Architecture')
    .setVersion('1.0')
    .addTag('Estados', 'Operações relacionadas aos estados brasileiros')
    .addTag('Municípios', 'Operações relacionadas aos municípios brasileiros')
    .addTag('Pessoas', 'Operações relacionadas às pessoas físicas e jurídicas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Embarka API Documentation',
    customfavIcon: '/favicon.ico',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
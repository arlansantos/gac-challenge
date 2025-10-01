import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API de Unidades Organizacionais')
    .setDescription(
      'API para gerenciar uma hierarquia de usuários e grupos usando o padrão Closure Table.',
    )
    .setVersion('1.0')
    .addTag('Users', 'Operações relacionadas a usuários')
    .addTag('Groups', 'Operações relacionadas a grupos')
    .addTag(
      'Nodes',
      'Operações genéricas de hierarquia (ancestrais/descendentes)',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

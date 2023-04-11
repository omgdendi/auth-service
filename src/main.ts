import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number.parseInt(process.env.PORT) || 3005;
  app.setGlobalPrefix('api');
  //TODO: allow only internal applications
  app.enableCors();
  swagger(app);
  await app.listen(port);
}
bootstrap();

function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Auth')
    .setDescription('Authorization Service API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('api/docs', app, document);
  patchNestJsSwagger();
}

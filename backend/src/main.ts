import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      name: 'SESSION',
      secret: 'amoba-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
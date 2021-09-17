import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

async function bootstrap() {
  config({
    path: __dirname + '/../prod.env',
  });
  const app = await NestFactory.create(AppModule);
  await app.listen(3019);
}
bootstrap();

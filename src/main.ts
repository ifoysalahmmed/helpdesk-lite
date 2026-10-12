import { NestFactory } from '@nestjs/core';
import { existsSync } from 'node:fs';
import { AppModule, ObserveInstrument } from './app.module.js';

if (existsSync('.env')) process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

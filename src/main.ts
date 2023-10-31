import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('v1');
  await app.listen(3000);
}
bootstrap();

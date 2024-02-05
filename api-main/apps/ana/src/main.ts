import { NestFactory } from '@nestjs/core';
import { AnaModule } from './ana.module';

async function bootstrap() {
  const app = await NestFactory.create(AnaModule);
  await app.listen(3000);
}
bootstrap();

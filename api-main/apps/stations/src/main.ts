import { NestFactory } from '@nestjs/core';
import { StationsModule } from './stations.module';

async function bootstrap() {
  const app = await NestFactory.create(StationsModule);
  await app.listen(3000);
}
bootstrap();

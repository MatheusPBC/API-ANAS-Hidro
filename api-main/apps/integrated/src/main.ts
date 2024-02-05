import { NestFactory } from '@nestjs/core';
import { IntegratedModule } from './integrated.module';

async function bootstrap() {
  const app = await NestFactory.create(IntegratedModule);
  await app.listen(3000);
}
bootstrap();

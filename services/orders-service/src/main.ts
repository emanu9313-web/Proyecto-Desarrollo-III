import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  await app.listen(Number(process.env.PORT ?? 3003), '0.0.0.0');
}

void bootstrap();

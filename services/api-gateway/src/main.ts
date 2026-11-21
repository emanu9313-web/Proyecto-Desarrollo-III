import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
<<<<<<< HEAD
=======
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET es obligatorio');
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000' });
  await app.listen(Number(process.env.PORT ?? 8080), '0.0.0.0');
}

void bootstrap();

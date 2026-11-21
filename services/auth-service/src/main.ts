import 'reflect-metadata';
<<<<<<< HEAD
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
=======
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthExceptionFilter } from './infrastructure/http/auth-exception.filter';

async function bootstrap() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET es obligatorio');
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000' });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const invalidDomain = errors.some((error) =>
        error.property === 'email' && typeof error.value === 'string' &&
        Boolean(error.constraints?.matches),
      );
      if (invalidDomain) {
        return new BadRequestException({
          statusCode: 400,
          code: 'INVALID_EMAIL_DOMAIN',
          message: 'Solo se permiten correos @correounivalle.edu.co',
        });
      }
      return new BadRequestException({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: 'El cuerpo de la solicitud no es válido',
        details: errors.map(({ property, constraints }) => ({ property, constraints })),
      });
    },
  }));
  app.useGlobalFilters(new AuthExceptionFilter());
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
  await app.listen(Number(process.env.PORT ?? 3001), '0.0.0.0');
}

void bootstrap();

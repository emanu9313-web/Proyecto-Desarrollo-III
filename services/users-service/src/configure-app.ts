import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AuthExceptionFilter } from './infrastructure/http/auth-exception.filter';

export function configureApp(app: INestApplication): void {
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
}

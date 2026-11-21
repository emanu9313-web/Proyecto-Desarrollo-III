import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InvalidCredentialsError, InvalidEmailDomainError } from '../../domain/errors/auth.errors';

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof InvalidEmailDomainError) {
      return response.status(400).json({ statusCode: 400, code: exception.code, message: exception.message });
    }
    if (exception instanceof InvalidCredentialsError) {
      return response.status(401).json({ statusCode: 401, code: exception.code, message: exception.message });
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const detail = exception.getResponse();
      return response.status(status).json(typeof detail === 'string' ? { statusCode: status, message: detail } : detail);
    }
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ocurrió un error interno',
    });
  }
}

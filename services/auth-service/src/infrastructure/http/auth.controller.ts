<<<<<<< HEAD
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
=======
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
import { Request } from 'express';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { LoginDto } from './login.dto';
import { AuthGuard } from './auth.guard';
import { LoginAttempts } from '../security/login-attempts';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';

interface AuthenticatedRequest extends Request {
  auth: { sub: string; role: string };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly login: LoginUseCase,
    private readonly currentUser: GetCurrentUserUseCase,
    private readonly attempts: LoginAttempts,
  ) {}

  @Post('login')
<<<<<<< HEAD
  @HttpCode(HttpStatus.OK)
=======
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
  async signIn(@Body() body: LoginDto, @Req() request: Request) {
    const forwardedFor = request.headers['x-forwarded-for'];
    const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0])?.trim() || request.ip || 'unknown';
    this.attempts.assertAllowed(ip);
    try {
      return await this.login.execute(body);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) this.attempts.recordFailure(ip);
      throw error;
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return this.currentUser.execute(request.auth.sub);
  }
}

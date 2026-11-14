import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GatewayAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isLogin = request.method === 'POST' && request.path === '/api/auth/login';
    if (isLogin) return true;

    const authorization = request.headers.authorization;
    if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwt.verify(authorization.slice(7));
      if (!payload.sub || !payload.role) throw new Error('Invalid token');
      request.auth = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

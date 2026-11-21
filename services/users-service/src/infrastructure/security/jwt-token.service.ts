import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, TokenService } from '../../application/ports/auth.ports';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly expiresIn = 3600;

  constructor(private readonly jwt: JwtService) {}

  sign(payload: TokenPayload) {
    return {
      token: this.jwt.sign(payload),
      expiresIn: this.expiresIn,
    };
  }

  verify(token: string): TokenPayload {
    const payload = this.jwt.verify<TokenPayload>(token);
    if (!payload.sub || !payload.role) throw new Error('Invalid token payload');
    return payload;
  }
}

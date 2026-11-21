import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PasswordHasher } from '../../application/ports/auth.ports';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  private readonly rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

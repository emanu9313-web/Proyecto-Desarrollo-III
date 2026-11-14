import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

const WINDOW_MS = 60_000;
const MAX_FAILURES = 5;

@Injectable()
export class LoginAttempts {
  private readonly failures = new Map<string, number[]>();

  assertAllowed(ip: string) {
    const recent = this.getRecent(ip);
    if (recent.length >= MAX_FAILURES) {
      throw new HttpException({
        statusCode: 429,
        code: 'LOGIN_RATE_LIMITED',
        message: 'Demasiados intentos fallidos. Espera un minuto e inténtalo de nuevo.',
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  recordFailure(ip: string) {
    this.failures.set(ip, [...this.getRecent(ip), Date.now()]);
  }

  private getRecent(ip: string): number[] {
    const cutoff = Date.now() - WINDOW_MS;
    const recent = (this.failures.get(ip) ?? []).filter((timestamp) => timestamp > cutoff);
    if (recent.length) this.failures.set(ip, recent);
    else this.failures.delete(ip);
    return recent;
  }
}

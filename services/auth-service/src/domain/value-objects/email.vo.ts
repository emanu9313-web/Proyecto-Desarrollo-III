import { InvalidEmailDomainError } from '../errors/auth.errors';

const INSTITUTIONAL_EMAIL = /^[a-z0-9._%+-]+@correounivalle\.edu\.co$/;

export class Email {
  private constructor(readonly value: string) {}

  static create(input: string): Email {
    const normalized = input.trim().toLowerCase();
    if (!INSTITUTIONAL_EMAIL.test(normalized)) {
      throw new InvalidEmailDomainError();
    }
    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

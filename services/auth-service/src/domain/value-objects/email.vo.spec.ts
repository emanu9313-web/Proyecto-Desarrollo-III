import { describe, expect, it } from '@jest/globals';
import { InvalidEmailDomainError } from '../errors/auth.errors';
import { Email } from './email.vo';

describe('Email', () => {
  it('normalizes whitespace and uppercase letters', () => {
    expect(Email.create('  ANA.GOMEZ@CORREOUNIVALLE.EDU.CO  ').value)
      .toBe('ana.gomez@correounivalle.edu.co');
  });

  it.each([
    'ana@gmail.com',
    'ana@univalle.edu.co',
    'ana@correounivalle.edu.co.evil.com',
    'ana@@correounivalle.edu.co',
    '@correounivalle.edu.co',
    '',
  ])('rejects invalid institutional address %s', (value) => {
    expect(() => Email.create(value)).toThrow(InvalidEmailDomainError);
  });
});

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { PasswordHasher, UserRepository } from '../../application/ports/auth.ports';
import { SeedUsers } from './seed-users';

describe('SeedUsers', () => {
  let records: Map<string, User>;
  let repository: UserRepository;
  let passwords: PasswordHasher;
  let previousEnvironment: string | undefined;

  beforeEach(() => {
    previousEnvironment = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    records = new Map();
    repository = {
      findByEmail: jest.fn(async (email: Email) => records.get(email.value) ?? null),
      findById: jest.fn(async () => null),
      save: jest.fn(async (user: User) => { records.set(user.email.value, user); }),
    };
    passwords = {
      hash: jest.fn(async (plain: string) => `hash:${plain}`),
      compare: jest.fn(async () => false),
    };
  });

  afterEach(() => {
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
  });

  it('CA-07 creates the three development accounts once with password hashes', async () => {
    const seed = new SeedUsers(repository, passwords);
    await seed.onApplicationBootstrap();
    await seed.onApplicationBootstrap();

    expect(records.size).toBe(3);
    expect(repository.save).toHaveBeenCalledTimes(3);
    expect(passwords.hash).toHaveBeenCalledWith('Univalle2026*');
    expect([...records.values()].every((user) => user.passwordHash === 'hash:Univalle2026*')).toBe(true);
  });

  it('does not create development users in production', async () => {
    process.env.NODE_ENV = 'production';
    await new SeedUsers(repository, passwords).onApplicationBootstrap();

    expect(repository.findByEmail).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
    expect(passwords.hash).not.toHaveBeenCalled();
  });
});

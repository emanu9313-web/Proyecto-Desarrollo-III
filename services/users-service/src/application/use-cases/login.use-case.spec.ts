import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { PasswordHasher, TokenService, UserRepository } from '../ports/auth.ports';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  const email = Email.create('ana.gomez@correounivalle.edu.co');
  const user = User.create({
    id: '66f000000000000000000001',
    fullName: 'Ana Gómez',
    email,
    passwordHash: 'hash',
    role: 'STUDENT',
    isActive: true,
  });

  let findByEmail: jest.Mock<(email: Email) => Promise<User | null>>;
  let compare: jest.Mock<(plain: string, hash: string) => Promise<boolean>>;
  let sign: jest.Mock;
  let useCase: LoginUseCase;

  beforeEach(() => {
    findByEmail = jest.fn<(email: Email) => Promise<User | null>>().mockResolvedValue(user);
    compare = jest.fn<(plain: string, hash: string) => Promise<boolean>>().mockResolvedValue(true);
    sign = jest.fn().mockReturnValue({ token: 'signed-token', expiresIn: 3600 });
    useCase = new LoginUseCase(
      { findByEmail, findById: jest.fn(), save: jest.fn() } as UserRepository,
      { compare, hash: jest.fn() } as PasswordHasher,
      { sign, verify: jest.fn() } as TokenService,
    );
  });

  it('issues a token and returns public user data for valid credentials', async () => {
    await expect(useCase.execute({ email: email.value, password: 'Secret123*' })).resolves.toEqual({
      accessToken: 'signed-token',
      expiresIn: 3600,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: email.value,
        role: 'STUDENT',
      },
    });
    expect(sign).toHaveBeenCalledWith({ sub: user.id, role: 'STUDENT' });
  });

  it('rejects a bad domain before querying the repository', async () => {
    await expect(useCase.execute({ email: 'ana@gmail.com', password: 'Secret123*' }))
      .rejects.toThrow('Solo se permiten correos @correounivalle.edu.co');
    expect(findByEmail).not.toHaveBeenCalled();
  });

  it('uses the same error for a missing user and a wrong password', async () => {
    findByEmail.mockResolvedValueOnce(null);
    await expect(useCase.execute({ email: email.value, password: 'bad' })).rejects.toBeInstanceOf(InvalidCredentialsError);

    compare.mockResolvedValueOnce(false);
    await expect(useCase.execute({ email: email.value, password: 'bad' })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('rejects inactive accounts', async () => {
    findByEmail.mockResolvedValueOnce(User.create({ ...user.props, isActive: false }));
    await expect(useCase.execute({ email: email.value, password: 'Secret123*' })).rejects.toBeInstanceOf(InvalidCredentialsError);
    expect(compare).not.toHaveBeenCalled();
  });
});

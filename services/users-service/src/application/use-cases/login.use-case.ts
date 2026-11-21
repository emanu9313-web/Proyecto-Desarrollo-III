import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import { toPublicUser } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { PASSWORD_HASHER, PasswordHasher, TOKEN_SERVICE, TokenService, USER_REPOSITORY, UserRepository } from '../ports/auth.ports';

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly passwords: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async execute(input: { email: string; password: string }) {
    const email = Email.create(input.email);
    const user = await this.users.findByEmail(email);
    if (!user || !user.isActive) throw new InvalidCredentialsError();

    const matches = await this.passwords.compare(input.password, user.passwordHash);
    if (!matches) throw new InvalidCredentialsError();

    const { token, expiresIn } = this.tokens.sign({ sub: user.id, role: user.role });
    return { accessToken: token, expiresIn, user: toPublicUser(user) };
  }
}

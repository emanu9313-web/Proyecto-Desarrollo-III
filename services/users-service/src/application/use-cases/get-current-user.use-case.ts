import { InvalidCredentialsError } from '../../domain/errors/auth.errors';
import { toPublicUser } from '../../domain/entities/user.entity';
import { USER_REPOSITORY, UserRepository } from '../ports/auth.ports';

export class GetCurrentUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: string) {
    const user = await this.users.findById(id);
    if (!user || !user.isActive) throw new InvalidCredentialsError();
    return toPublicUser(user);
  }
}

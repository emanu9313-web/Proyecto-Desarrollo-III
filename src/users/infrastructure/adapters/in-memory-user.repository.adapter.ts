import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/ports/repositories/user.repository';

@Injectable()
export class InMemoryUserRepositoryAdapter implements UserRepository {
  private readonly users = new Map<string, User>();

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (
      [...this.users.values()].find((user) => user.email === email) ?? null
    );
  }
}

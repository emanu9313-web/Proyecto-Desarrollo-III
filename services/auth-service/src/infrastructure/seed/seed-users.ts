import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Email } from '../../domain/value-objects/email.vo';
import { User, UserRole } from '../../domain/entities/user.entity';
import { PasswordHasher, PASSWORD_HASHER, USER_REPOSITORY, UserRepository } from '../../application/ports/auth.ports';
import { Inject } from '@nestjs/common';

const SEED_USERS: Array<{ fullName: string; email: string; role: UserRole }> = [
  { fullName: 'Ana Gómez', email: 'ana.gomez@correounivalle.edu.co', role: 'STUDENT' },
  { fullName: 'Carlos Ruiz', email: 'carlos.ruiz@correounivalle.edu.co', role: 'TEACHER' },
  { fullName: 'Marta Díaz', email: 'marta.diaz@correounivalle.edu.co', role: 'STAFF' },
];

@Injectable()
export class SeedUsers implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedUsers.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwords: PasswordHasher,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV === 'production') return;
    const passwordHash = await this.passwords.hash('Univalle2026*');
    for (const entry of SEED_USERS) {
      const email = Email.create(entry.email);
      if (await this.users.findByEmail(email)) continue;
      await this.users.save(User.create({
        id: '', fullName: entry.fullName, email, passwordHash,
        role: entry.role, isActive: true,
      }));
    }
    this.logger.log('Usuarios de desarrollo listos');
  }
}

import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { USER_REPOSITORY } from './domain/ports/repositories/user.repository';
import { InMemoryUserRepositoryAdapter } from './infrastructure/adapters/in-memory-user.repository.adapter';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepositoryAdapter,
    },
  ],
})
export class UsersModule {}

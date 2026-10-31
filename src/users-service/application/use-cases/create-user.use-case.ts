import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { User } from "../../domain/entities/user.entity";
import { USER_REPOSITORY } from "../../domain/ports/repositories/user.repository";
import type { UserRepository } from "../../domain/ports/repositories/user.repository";

export interface CreateUserInput {
  name: string;
  email: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException("Ya existe un usuario con ese correo.");
    }

    const user = User.create({
      id: randomUUID(),
      name: input.name.trim(),
      email,
      createdAt: new Date(),
    });

    return this.userRepository.save(user);
  }
}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { USER_REPOSITORY } from "./domain/ports/repositories/user.repository";
import { MongoUserRepositoryAdapter } from "./infrastructure/adapters/mongo-user.repository.adapter";
import { UserRecord, UserSchema } from "./infrastructure/schemas/user.schema";
import { UsersController } from "./users.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserRecord.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepositoryAdapter,
    },
  ],
})
export class UsersModule {}

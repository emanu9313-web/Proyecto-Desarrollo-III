<<<<<<< HEAD
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>("MONGO_URI") ??
          config.get<string>("MONGODB_URI") ??
          "mongodb://127.0.0.1:27017/univalle-shop",
      }),
    }),
    AuthModule,
=======
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { AuthController } from './infrastructure/http/auth.controller';
import { HealthController } from './infrastructure/http/health.controller';
import { AuthGuard } from './infrastructure/http/auth.guard';
import { MongoUserRepository } from './infrastructure/persistence/mongo-user.repository';
import { UserRecord, UserSchema } from './infrastructure/persistence/user.schema';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { JwtTokenService } from './infrastructure/security/jwt-token.service';
import {
  PASSWORD_HASHER, PasswordHasher, TOKEN_SERVICE, TokenService,
  USER_REPOSITORY, UserRepository,
} from './application/ports/auth.ports';
import { SeedUsers } from './infrastructure/seed/seed-users';
import { LoginAttempts } from './infrastructure/security/login-attempts';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/univalle_users'),
    MongooseModule.forFeature([{ name: UserRecord.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: 3600 },
    }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
  ],
  controllers: [AuthController, HealthController],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (users: UserRepository, passwords: PasswordHasher, tokens: TokenService) =>
        new LoginUseCase(users, passwords, tokens),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (users: UserRepository) => new GetCurrentUserUseCase(users),
      inject: [USER_REPOSITORY],
    },
    AuthGuard,
    MongoUserRepository,
    BcryptPasswordHasher,
    JwtTokenService,
    SeedUsers,
    LoginAttempts,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: USER_REPOSITORY, useExisting: MongoUserRepository },
    { provide: PASSWORD_HASHER, useExisting: BcryptPasswordHasher },
    { provide: TOKEN_SERVICE, useExisting: JwtTokenService },
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
  ],
})
export class AppModule {}

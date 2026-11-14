import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { LoginUseCase } from '../src/application/use-cases/login.use-case';
import { GetCurrentUserUseCase } from '../src/application/use-cases/get-current-user.use-case';
import {
  PASSWORD_HASHER, PasswordHasher, TOKEN_SERVICE, TokenPayload, TokenService,
  USER_REPOSITORY, UserRepository,
} from '../src/application/ports/auth.ports';
import { AuthController } from '../src/infrastructure/http/auth.controller';
import { AuthGuard } from '../src/infrastructure/http/auth.guard';
import { AuthExceptionFilter } from '../src/infrastructure/http/auth-exception.filter';
import { HealthController } from '../src/infrastructure/http/health.controller';
import { LoginAttempts } from '../src/infrastructure/security/login-attempts';
import { BcryptPasswordHasher } from '../src/infrastructure/security/bcrypt-password-hasher';
import { MongoUserRepository } from '../src/infrastructure/persistence/mongo-user.repository';
import { UserSchema, UserRecord } from '../src/infrastructure/persistence/user.schema';
import { SeedUsers } from '../src/infrastructure/seed/seed-users';
import { configureApp } from '../src/configure-app';

class TestTokenService implements TokenService {
  sign(_payload: TokenPayload) { return { token: 'test-token', expiresIn: 3600 }; }
  verify(token: string): TokenPayload {
    if (token !== 'test-token') throw new Error('Invalid token');
    return { sub: '66f000000000000000000001', role: 'STUDENT' };
  }
}

describe('Authentication HTTP API with MongoDB', () => {
  let app: NestExpressApplication;
  let mongo: MongoMemoryServer;
  const previousEnvironment = {
    nodeEnv: process.env.NODE_ENV,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    frontendOrigin: process.env.FRONTEND_ORIGIN,
  };

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({ binary: { version: '7.0.24' } });
    process.env.NODE_ENV = 'test';
    process.env.MONGO_URI = mongo.getUri('univalle_auth_test');
    process.env.JWT_SECRET = 'integration-test-secret-at-least-32-chars';
    process.env.FRONTEND_ORIGIN = 'http://localhost:3000';

    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongo.getUri('univalle_auth_test')),
        MongooseModule.forFeature([{ name: UserRecord.name, schema: UserSchema }]),
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
        MongoUserRepository,
        BcryptPasswordHasher,
        SeedUsers,
        LoginAttempts,
        AuthGuard,
        { provide: USER_REPOSITORY, useExisting: MongoUserRepository },
        { provide: PASSWORD_HASHER, useExisting: BcryptPasswordHasher },
        { provide: TOKEN_SERVICE, useClass: TestTokenService },
      ],
    }).compile();
    app = module.createNestApplication<NestExpressApplication>();
    configureApp(app);
    app.useGlobalFilters(new AuthExceptionFilter());
    await app.init();
  }, 120_000);

  afterAll(async () => {
    if (app) await app.close();
    if (mongo) await mongo.stop();
    if (previousEnvironment.nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment.nodeEnv;
    if (previousEnvironment.mongoUri === undefined) delete process.env.MONGO_URI;
    else process.env.MONGO_URI = previousEnvironment.mongoUri;
    if (previousEnvironment.jwtSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousEnvironment.jwtSecret;
    if (previousEnvironment.frontendOrigin === undefined) delete process.env.FRONTEND_ORIGIN;
    else process.env.FRONTEND_ORIGIN = previousEnvironment.frontendOrigin;
  }, 30_000);

  it('CA-01 returns a JWT and only public user fields for valid seeded credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ANA.GOMEZ@CORREOUNIVALLE.EDU.CO', password: 'Univalle2026*' })
      .expect(200);

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      expiresIn: 3600,
      user: {
        fullName: 'Ana Gómez',
        email: 'ana.gomez@correounivalle.edu.co',
        role: 'STUDENT',
      },
    });
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it('CA-02 rejects a non-institutional domain without inserting a user', async () => {
    const usersModel = app.get(getModelToken(UserRecord.name));
    const before = await usersModel.countDocuments();
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ana@gmail.com', password: 'Univalle2026*' })
      .expect(400);

    expect(response.body.code).toBe('INVALID_EMAIL_DOMAIN');
    expect(await usersModel.countDocuments()).toBe(before);
  });

  it('CA-03 responds generically for an unknown user and an incorrect password', async () => {
    const missing = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nadie@correounivalle.edu.co', password: 'Univalle2026*' })
      .expect(401);
    const incorrect = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ana.gomez@correounivalle.edu.co', password: 'wrong' })
      .expect(401);

    expect(missing.body).toEqual(incorrect.body);
    expect(missing.body).toMatchObject({ code: 'INVALID_CREDENTIALS', message: 'Credenciales inválidas' });
  });

  it('CA-04 reports missing and unexpected request fields', async () => {
    const missing = await request(app.getHttpServer()).post('/auth/login').send({}).expect(400);
    const extra = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ana.gomez@correounivalle.edu.co', password: 'Univalle2026*', unexpected: true })
      .expect(400);

    expect(missing.body.code).toBe('VALIDATION_ERROR');
    expect(extra.body.details).toBeDefined();
  });

  it('CA-05 protects /auth/me and returns the user for a valid bearer token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
    await request(app.getHttpServer()).get('/auth/me').set('Authorization', 'Bearer invalid').expect(401);
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ana.gomez@correounivalle.edu.co', password: 'Univalle2026*' })
      .expect(200);
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);

    expect(response.body).toEqual(login.body.user);
  });

  it('CA-06 blocks the sixth failed login from the same IP within one minute', async () => {
    for (let i = 0; i < 5; i += 1) {
      await request(app.getHttpServer())
        .post('/auth/login')
        .set('X-Forwarded-For', '203.0.113.8')
        .send({ email: 'ana.gomez@correounivalle.edu.co', password: 'wrong' })
        .expect(401);
    }
    const limited = await request(app.getHttpServer())
      .post('/auth/login')
      .set('X-Forwarded-For', '203.0.113.8')
      .send({ email: 'ana.gomez@correounivalle.edu.co', password: 'wrong' })
      .expect(429);

    expect(limited.body.code).toBe('LOGIN_RATE_LIMITED');
  });

  it('CA-07 seeds development users idempotently', async () => {
    const usersModel = app.get(getModelToken(UserRecord.name));
    await app.get(SeedUsers).onApplicationBootstrap();
    expect(await usersModel.countDocuments()).toBe(3);
  });

  it('CA-08 returns service health while MongoDB is available', async () => {
    await request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' });
  });
});

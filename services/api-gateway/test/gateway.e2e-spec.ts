import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { AuthProxyController } from '../src/auth-proxy.controller';
import { GatewayAuthGuard } from '../src/gateway-auth.guard';
import { HealthController } from '../src/health.controller';

describe('API Gateway HTTP contract', () => {
  let app: NestExpressApplication;
  let fetchMock: jest.SpiedFunction<typeof fetch>;
  const jwt = {
    verify: jest.fn((token: string) => {
      if (token !== 'valid-token') throw new Error('Invalid token');
      return { sub: 'user-1', role: 'STUDENT' };
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthProxyController, HealthController],
      providers: [GatewayAuthGuard, { provide: JwtService, useValue: jwt }],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.enableCors({ origin: 'http://localhost:3000' });
    await app.init();
    fetchMock = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(async () => {
    if (app) await app.close();
    jest.restoreAllMocks();
  });

  it('GW-01 proxies the public login method, URL, body, and response', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ accessToken: 'token' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));

    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'ana@correounivalle.edu.co', password: 'Secret123*' })
      .expect(200);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/auth/login',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'ana@correounivalle.edu.co', password: 'Secret123*' }) }),
    );
    expect(response.body).toEqual({ accessToken: 'token' });
  });

  it('GW-03 requires a valid JWT for protected auth routes', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: 'user-1' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3001/auth/me',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('GW-04 restricts CORS to the configured frontend origin', async () => {
    const response = await request(app.getHttpServer())
      .options('/api/auth/login')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .expect(204);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('GW-05 maps an upstream outage to a clear 503 response', async () => {
    fetchMock.mockRejectedValue(new Error('upstream unavailable'));
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'ana@correounivalle.edu.co', password: 'Secret123*' })
      .expect(503);

    expect(response.body).toMatchObject({
      code: 'AUTH_SERVICE_UNAVAILABLE',
      message: 'El servicio de autenticación no está disponible',
    });
  });

  it('GW-06 exposes a health response without contacting auth-service', async () => {
    await request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

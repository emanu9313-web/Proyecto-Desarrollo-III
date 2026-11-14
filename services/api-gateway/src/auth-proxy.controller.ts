import { All, Controller, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GatewayAuthGuard } from './gateway-auth.guard';
import { routesConfig } from './routes.config';

@Controller('api/auth')
@UseGuards(GatewayAuthGuard)
export class AuthProxyController {
  @All('{*path}')
  async proxy(@Req() request: Request, @Res() response: Response): Promise<void> {
    const target = routesConfig['/api/auth/*'];
    const suffix = request.originalUrl.replace(/^\/api\/auth/, '') || '/';
    const headers = new Headers();
    for (const [name, value] of Object.entries(request.headers)) {
      if (!value || ['host', 'content-length', 'connection'].includes(name.toLowerCase())) continue;
      headers.set(name, Array.isArray(value) ? value.join(', ') : value);
    }
    if (request.ip) headers.set('x-forwarded-for', request.ip);

    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 5_000);
    try {
      const upstream = await fetch(`${target}/auth${suffix}`, {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : JSON.stringify(request.body ?? {}),
        signal: abort.signal,
      });
      const contentType = upstream.headers.get('content-type');
      if (contentType) response.setHeader('content-type', contentType);
      response.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: 503,
        code: 'AUTH_SERVICE_UNAVAILABLE',
        message: 'El servicio de autenticación no está disponible',
      });
    } finally {
      clearTimeout(timer);
    }
  }
}

# Especificación: API Gateway

<<<<<<< HEAD
**Estado:** aprobada por el usuario para la Entrega 1.
=======
**Estado:** propuesta para revisión; aún no aprobada.
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)

## Propósito

Ser el único punto HTTP de entrada para el frontend y enrutar las llamadas de autenticación al `auth-service`.

## Requisitos y aceptación

- **GW-01:** enrutar `/api/auth/*` a `http://auth-service:3001/auth/*`, manteniendo método, cuerpo, cabeceras necesarias y respuesta.
- **GW-02:** mantener rutas futuras en `routes.config.ts` sin activarlas en esta entrega.
- **GW-03:** permitir rutas públicas `POST /api/auth/login` y `/health`; validar JWT en rutas protegidas.
- **GW-04:** limitar CORS al origen configurado del frontend y usar timeout de 5 segundos al servicio.
- **GW-05:** si el servicio de autenticación no responde, devolver HTTP 503 con mensaje claro; el Gateway sigue disponible.
- **GW-06:** exponer `/health` para salud del Gateway.

## Verificación

Probar proxy de login, manejo de token en rutas protegidas, CORS, timeout y respuesta 503 ante servicio no disponible. El frontend solo usará la URL del Gateway.

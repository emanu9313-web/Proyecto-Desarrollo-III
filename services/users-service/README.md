# Servicio de usuarios y autenticación

Servicio NestJS para autenticación institucional. El dominio contiene las reglas de `Email` y usuario; los casos de uso dependen de puertos; MongoDB, bcrypt, JWT y HTTP viven en `infrastructure`.

## Variables

| Variable | Propósito | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto HTTP | `3001` |
| `MONGO_URI` | Base de datos de usuarios | `mongodb://127.0.0.1:27017/univalle_users` |
| `JWT_SECRET` | Firma JWT, obligatoria | secreto aleatorio local |
| `FRONTEND_ORIGIN` | Origen CORS permitido | `http://localhost:3000` |
| `BCRYPT_ROUNDS` | Costo de bcrypt | `12` |
| `NODE_ENV` | Desactiva el seed en producción | `development` |

## Endpoints

- `POST /auth/login`: valida credenciales institucionales y emite JWT.
- `GET /auth/me`: requiere `Authorization: Bearer <token>`.
- `GET /health`: healthcheck.

El seed crea tres usuarios idempotentemente fuera de producción. En el despliegue Compose el Gateway expone el login como `POST /api/auth/login`.

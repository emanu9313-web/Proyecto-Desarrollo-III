# API Gateway

Gateway NestJS que valida JWT y enruta `/api/auth/*` a `AUTH_SERVICE_URL`. Mantiene `/api/auth/login` pública y exige token para las rutas restantes. Si users-service no responde dentro de cinco segundos, responde `503`.

## Variables

| Variable | Propósito | Ejemplo local |
| --- | --- | --- |
| `PORT` | Puerto HTTP | `8080` |
| `AUTH_SERVICE_URL` | URL interna del servicio | `http://localhost:3001` |
| `JWT_SECRET` | Debe coincidir con users-service | secreto aleatorio local |
| `FRONTEND_ORIGIN` | Origen CORS | `http://localhost:3000` |

## Endpoints

- `POST /api/auth/login`: proxy público.
- `GET /api/auth/me`: proxy protegido.
- `GET /health`: salud del Gateway.

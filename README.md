# univalle-shop-api

API backend de **Univalle Shop**, construida con Node.js, TypeScript y NestJS.

## Requisitos

- Node.js 20.19 o superior.
- npm (incluido con Node.js).
- MongoDB local o una instancia de MongoDB Atlas.

## Inicio rápido

```bash
npm install
Copy-Item .env.example .env # PowerShell; en macOS/Linux: cp .env.example .env
npm run start:dev
```

La URI predeterminada conecta con `mongodb://127.0.0.1:27017/univalle-shop`. Si usas Atlas, reemplaza `MONGODB_URI` en `.env` por la cadena de conexión de tu clúster. El servidor inicia cuando logra conectarse a MongoDB.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm run start:dev` | Ejecuta el servidor en modo desarrollo con recarga. |
| `npm run build` | Compila TypeScript en `dist/`. |
| `npm run start:prod` | Ejecuta la compilación de producción. |
| `npm run typecheck` | Revisa los tipos sin generar archivos. |

## Módulo `users`

El caso de uso `CreateUserUseCase` recibe el puerto `UserRepository` mediante `@Inject(USER_REPOSITORY)`. Nest enlaza ese token con `MongoUserRepositoryAdapter`, que guarda y consulta usuarios usando Mongoose. El dominio y el caso de uso no dependen directamente de MongoDB.

```text
src/users/
  domain/entities/user.entity.ts
  domain/ports/repositories/user.repository.ts
  application/use-cases/create-user.use-case.ts
  infrastructure/schemas/user.schema.ts
  infrastructure/adapters/mongo-user.repository.adapter.ts
  users.controller.ts
  users.module.ts
```

El endpoint es `POST /api/users`, con cuerpo `{ "name": "Ana", "email": "ana@example.com" }`. El correo tiene un índice único en MongoDB.

## Desarrollo

Configura las variables locales en `.env` a partir de `.env.example`. No subas credenciales ni secretos al repositorio.

# univalle-shop-api

API backend de **Univalle Shop**, construida con Node.js, TypeScript y NestJS.

## Requisitos

- Node.js 20.19 o superior.
- npm (incluido con Node.js).

## Inicio rápido

```bash
npm install
Copy-Item .env.example .env # PowerShell; en macOS/Linux: cp .env.example .env
npm run start:dev
```

La API queda disponible en `http://localhost:3000`; `GET /` devuelve el estado de bienvenida.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm run start:dev` | Ejecuta el servidor en modo desarrollo con recarga. |
| `npm run build` | Compila TypeScript en `dist/`. |
| `npm run start:prod` | Ejecuta la compilación de producción. |
| `npm run typecheck` | Revisa los tipos sin generar archivos. |
| `npm run lint` | Ejecuta ESLint sobre el código. |

## Estructura

El módulo `users` separa las reglas del dominio, los casos de uso y la adaptación a NestJS. El caso de uso depende del puerto `UserRepository`; el adaptador en memoria lo implementa para este primer paso. Así se puede reemplazar por persistencia real sin acoplar el dominio a la base de datos.

```text
src/
  app.module.ts
  main.ts
  users/
    domain/
      entities/user.entity.ts
      ports/repositories/user.repository.ts
    application/use-cases/create-user.use-case.ts
    infrastructure/adapters/in-memory-user.repository.adapter.ts
    users.controller.ts
    users.module.ts
```

El endpoint inicial es `POST /users`, con cuerpo `{ "name": "Ana", "email": "ana@example.com" }`.

## Desarrollo

Las variables de entorno locales se configuran en `.env` a partir de `.env.example`. No se deben subir secretos al repositorio.

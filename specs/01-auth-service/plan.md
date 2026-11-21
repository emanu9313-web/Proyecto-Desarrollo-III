# Plan técnico: servicio de usuarios y autenticación

<<<<<<< HEAD
**Estado:** aprobado como diseño de la Entrega 1.
=======
**Estado:** propuesta para revisión; depende de la aprobación de `spec.md`.
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)

## Estructura hexagonal

- `domain/value-objects/email.vo.ts`: normaliza y valida correo institucional sin dependencias externas.
- `domain/entities/user.entity.ts`: entidad y reglas de estado/rol del usuario.
- `domain/errors/`: errores de dominio para correo inválido y credenciales inválidas.
- `application/ports/`: `UserRepository`, `PasswordHasher` y `TokenService`.
- `application/use-cases/login.use-case.ts`: validar correo antes del acceso a datos, buscar usuario, verificar estado/clave y emitir token.
- `application/use-cases/get-current-user.use-case.ts`: resolver identidad autenticada a usuario público.
- `infrastructure/http/`: controladores, DTOs, guard JWT y filtro de excepciones.
- `infrastructure/persistence/`: esquema Mongo y adaptador de repositorio.
- `infrastructure/security/`: adaptadores bcrypt y JWT.
- `infrastructure/seed/`: seed idempotente, condicionado por entorno.

## Orden de dependencias

El dominio permanece puro. La aplicación solo importa dominio y puertos. Infraestructura implementa puertos y conecta los adaptadores mediante tokens de inyección de NestJS. Ningún controlador o esquema Mongoose se importa desde dominio/aplicación.

## Configuración y operación

Variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_ORIGIN`, `PORT` y `NODE_ENV`; publicar nombres y valores de ejemplo seguros en `.env.example`, nunca secretos reales. El proceso escucha en 3001 según Compose. La salud debe permitir verificar disponibilidad de la dependencia MongoDB.

## Verificación

Escribir pruebas de dominio y aplicación antes de integrar adaptadores. Luego añadir pruebas HTTP con Mongo de prueba para verificar contratos, autenticación, rate limit, validación y healthcheck. Este documento no autoriza implementar hasta que la especificación quede aprobada.

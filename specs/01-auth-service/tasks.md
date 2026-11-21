# Tareas: servicio de usuarios y autenticación

<<<<<<< HEAD
**Estado:** aprobadas para la Entrega 1; el progreso se registra en el changelog y el PR de entrega.
=======
**Estado:** propuesta para revisión; ejecutar después de aprobar `spec.md` y `plan.md`.
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)

1. Crear el esqueleto NestJS y configuración de lint/format para `auth-service`.
2. Implementar `Email` y errores del dominio; cubrir normalización y reglas de dominio.
3. Implementar entidad `User` y puertos de repositorio, hasher y tokens.
4. Implementar `LoginUseCase` con dobles en memoria y criterios de dominio/credenciales.
5. Implementar caso de uso y puerto de usuario autenticado para `/auth/me`.
6. Añadir DTOs, controlador, filtro de errores, validación global y guard JWT.
7. Implementar adaptador Mongo, índice único y configuración independiente de la BD `users`.
8. Implementar adaptadores bcrypt/JWT, configuración segura, CORS, Helmet y limitación de intentos.
9. Implementar healthcheck y seed idempotente limitado a desarrollo.
10. Añadir pruebas E2E para CA-01 a CA-08 y documentar variables/endpoints.
11. Preparar Dockerfile multi-stage no root y verificar integración con Compose una vez integrado el Gateway y frontend.

Cada tarea debe corresponder a un cambio pequeño y verificable. No crear commits ni registrar historias en Jira/GitHub sin disponibilidad y autorización explícita de esos servicios.

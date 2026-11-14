# Especificación: servicio de usuarios y autenticación

**Estado:** aprobada por el usuario para la Entrega 1.

## Propósito y alcance

Proveer autenticación funcional para integrantes de la Universidad del Valle mediante correo institucional y contraseña. En esta entrega el servicio expone login, consulta del usuario autenticado y healthcheck. El alta de usuarios queda pendiente por la discrepancia registrada en `../00-constitution.md`.

## Requisitos funcionales

- **RF-01:** permitir login con correo y contraseña.
- **RF-02:** aceptar únicamente correos `@correounivalle.edu.co`; normalizar con `trim()` y minúsculas. Validar tanto en DTO como en el value object `Email`.
- **RF-03:** ante login exitoso, devolver JWT, expiración y datos públicos del usuario.
- **RF-04:** `GET /auth/me` devuelve el usuario asociado al token válido.
- **RF-05:** persistir únicamente hash bcrypt de la contraseña.
- **RF-06:** seed de usuarios de prueba idempotente en desarrollo y nunca en producción.
- **RF-07:** `GET /health` devuelve estado saludable para Docker.

## Reglas de correo

Tras normalizar, validar con `^[a-z0-9._%+-]+@correounivalle\.edu\.co$`. Rechazar, entre otros, `ana@gmail.com`, `ana@univalle.edu.co`, `ana@correounivalle.edu.co.evil.com`, `ana@@correounivalle.edu.co`, `@correounivalle.edu.co` y cadena vacía. El dominio inválido no debe causar consulta al repositorio.

## Criterios de aceptación

- **CA-01:** Dado un usuario activo existente con correo institucional y contraseña correcta, cuando hace `POST /auth/login`, entonces recibe HTTP 200 con `accessToken`, `expiresIn` y `user` sin hash.
- **CA-02:** Dado un correo de otro dominio, cuando intenta login, entonces recibe HTTP 400 con código `INVALID_EMAIL_DOMAIN` y el repositorio no es consultado.
- **CA-03:** Dado un correo institucional inexistente, una contraseña incorrecta o un usuario inactivo, cuando intenta login, entonces recibe HTTP 401 con código `INVALID_CREDENTIALS` y mensaje genérico `Credenciales inválidas`.
- **CA-04:** Dado un cuerpo ausente, incompleto o con campos no permitidos, cuando llama al endpoint, entonces recibe HTTP 400 con detalle de validación.
- **CA-05:** Dado un token válido, cuando llama `GET /auth/me`, entonces recibe HTTP 200 con los datos públicos del usuario; con token ausente o inválido recibe HTTP 401.
- **CA-06:** Dados cinco intentos fallidos desde la misma IP dentro de un minuto, cuando ocurre el siguiente intento, entonces recibe HTTP 429.
- **CA-07:** Dado un entorno distinto de producción, cuando se ejecuta el seed más de una vez, entonces permanecen exactamente los usuarios de prueba sin duplicados; en producción el seed no se ejecuta.
- **CA-08:** Dado que MongoDB responde, cuando se consulta `GET /health`, entonces recibe HTTP 200 `{ "status": "ok" }`.

## Contrato HTTP

### `POST /auth/login`

Request:

```json
{ "email": "ana.gomez@correounivalle.edu.co", "password": "Secreta123*" }
```

Éxito `200`:

```json
{
  "accessToken": "<jwt>",
  "expiresIn": 3600,
  "user": {
    "id": "<id>",
    "fullName": "Ana Gómez",
    "email": "ana.gomez@correounivalle.edu.co",
    "role": "STUDENT"
  }
}
```

Errores de dominio `400`: `{ "statusCode": 400, "code": "INVALID_EMAIL_DOMAIN", "message": "Solo se permiten correos @correounivalle.edu.co" }`.

Credenciales `401`: `{ "statusCode": 401, "code": "INVALID_CREDENTIALS", "message": "Credenciales inválidas" }`.

### `GET /auth/me`

Requiere `Authorization: Bearer <token>`. Devuelve `200` y el objeto público `user`; token inválido o ausente produce `401`.

### `GET /health`

Devuelve `200 { "status": "ok" }` cuando el servicio está saludable.

## Modelo de datos

Colección `users`: `_id`, `fullName`, `email` (minúsculas, índice único), `passwordHash`, `role` (`STUDENT | TEACHER | STAFF`), `isActive` (default `true`), `createdAt` y `updatedAt`.

## Seguridad

- bcrypt con 10–12 rondas.
- JWT firmado con `JWT_SECRET` de entorno y expiración de una hora.
- Helmet, CORS limitado al origen del frontend, `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`.
- Limitar intentos según CA-06.
- Nunca incluir hashes en respuestas ni credenciales/tokens en logs.

## Datos de desarrollo

El seed indicado por la guía incluye Ana Gómez (`STUDENT`), Carlos Ruiz (`TEACHER`) y Marta Díaz (`STAFF`), todos con contraseña de desarrollo `Univalle2026*`. Estos datos solo existen en modo no productivo; almacenar las contraseñas como hashes.

## Pruebas exigidas

- Dominio: casos válidos e inválidos de correo.
- Caso de uso con dobles en memoria: login correcto, dominio inválido sin invocar repositorio, usuario inexistente, contraseña errónea y usuario inactivo.
- E2E con Mongo de prueba o `mongodb-memory-server` para CA-01 a CA-06 y healthcheck.
- Cobertura sugerida por la guía: al menos 80% para `domain` y `application`.

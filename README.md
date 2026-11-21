# Univalle Shop

<<<<<<< HEAD
Tienda virtual académica para estudiantes, docentes y personal administrativo de la Universidad del Valle. La Entrega 1 integra autenticación institucional, un API Gateway y un frontend React con módulos mock.

## Arquitectura

- `services/auth-service`: NestJS, MongoDB y arquitectura hexagonal para login, JWT y consulta de usuario.
- `services/api-gateway`: NestJS; único punto HTTP que usa el frontend y proxy de `/api/auth/*`.
- `frontend`: React, Vite y TypeScript; catálogo, producto, búsqueda, recomendados, carrito, pedidos y checkout de demostración.
- `users-db`: MongoDB privada del servicio de autenticación.
- `specs/`: constitución, requisitos, plan y tareas aprobados antes de implementar.

El registro de usuarios está fuera del alcance de esta entrega, según la resolución de alcance aprobada y documentada en `specs/00-constitution.md`.

## Requisitos

Docker Engine con Docker Compose para levantar el sistema completo. Para desarrollo local se requiere Node.js 24 LTS y MongoDB.

## Ejecutar con Docker Compose

1. Copia `.env.example` como `.env`.
2. Reemplaza `JWT_SECRET` por una cadena aleatoria larga.
3. Desde la raíz ejecuta `docker compose up --build`.
4. Abre `http://localhost:3000`.

Usuarios de desarrollo (el seed no corre en producción):
=======
Tienda virtual académica para la comunidad de la Universidad del Valle. La Entrega 1 integra login institucional, un API Gateway y un frontend React con módulos mock para catálogo, búsqueda, recomendados, carrito, pedidos y checkout simulado.

## Arquitectura

- `services/auth-service`: NestJS, MongoDB y arquitectura hexagonal para autenticación.
- `services/api-gateway`: NestJS, punto de entrada HTTP, proxy de `/api/auth/*`.
- `frontend`: React + Vite; el navegador llama únicamente al Gateway.
- `users-db`: base MongoDB privada del servicio de autenticación.
- `specs/`: constitución, requisitos, plan y tareas. La especificación de autenticación fue aprobada antes de iniciar el código.

El registro de usuarios se mantiene fuera de alcance de Entrega 1 hasta resolver la diferencia entre las secciones de la guía; ver `specs/00-constitution.md`.

## Requisitos

Docker Engine con Docker Compose. Para desarrollo sin contenedores se requiere Node.js 20 o posterior y MongoDB.

## Ejecutar con Docker Compose

1. Copia `.env.example` como `.env` y reemplaza `JWT_SECRET` por una cadena aleatoria larga.
2. Desde la raíz del proyecto ejecuta `docker compose up --build`.
3. Abre `http://localhost:3000`.

Usuarios de desarrollo (disponibles solo fuera de producción):
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Estudiante | `ana.gomez@correounivalle.edu.co` | `Univalle2026*` |
| Docente | `carlos.ruiz@correounivalle.edu.co` | `Univalle2026*` |
| Administrativo | `marta.diaz@correounivalle.edu.co` | `Univalle2026*` |

<<<<<<< HEAD
Frontend: `http://localhost:3000`. Gateway: `http://localhost:8080`; salud en `/health`. Auth service: puerto `3001`; salud en `/health`. El login debe realizarse por el Gateway en `POST /api/auth/login`.

## Desarrollo local

1. Copia `.env.example` a `.env`. Para MongoDB local, usa `MONGO_URI=mongodb://127.0.0.1:27017/univalle_users`.
2. Instala las dependencias desde la raíz: `npm install`.
3. En terminales separadas ejecuta `npm run dev:auth`, `npm run dev:gateway` y `npm run dev:frontend`.

El frontend usa `VITE_API_URL` para la URL pública del Gateway. El login acepta únicamente correos `@correounivalle.edu.co`. Los datos mock de comercio son locales; no se realiza ningún pago real.

## Configuración

Consulta `.env.example`. No guardes secretos reales en GitHub. `JWT_SECRET` debe ser idéntico en auth-service y Gateway. El JWT expira en una hora. `FRONTEND_ORIGIN` limita CORS. Cada servicio mantiene su propia configuración y despliegue en Docker Compose.

## Documentación SDD
=======
Endpoints locales: frontend `:3000`, Gateway `:8080`, health del Gateway `/health`, autenticación directa de desarrollo `:3001/health`. Las peticiones del frontend van por `http://localhost:8080/api`.

## Desarrollo local

Desde la raíz instala dependencias con `npm install`. Inicia MongoDB y configura `MONGO_URI` y `JWT_SECRET` para auth-service; después abre terminales separadas y ejecuta `npm run dev:auth`, `npm run dev:gateway` y `npm run dev:frontend`. La UI consume mocks de catálogo y usa el Gateway para autenticación.

## Configuración

Consulta `.env.example`. No guardes secretos reales en el repositorio. El JWT dura una hora. `JWT_SECRET` debe ser el mismo para el Gateway y auth-service. `FRONTEND_ORIGIN` limita CORS. El catálogo, los pedidos, los pagos y otros módulos no tienen backend en esta entrega.

## Documentación
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)

- [Constitución](specs/00-constitution.md)
- [Especificación de autenticación](specs/01-auth-service/spec.md)
- [Plan de autenticación](specs/01-auth-service/plan.md)
- [Tareas de autenticación](specs/01-auth-service/tasks.md)
<<<<<<< HEAD
- [Especificación del API Gateway](specs/02-api-gateway/spec.md)
- [Especificación del frontend](specs/03-frontend/spec.md)

## Build

`npm run build` compila los workspaces de auth-service, Gateway y frontend.
=======
- [API Gateway](specs/02-api-gateway/spec.md)
- [Frontend](specs/03-frontend/spec.md)
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)

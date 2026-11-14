# Constitución del proyecto Univalle Shop

**Estado:** aprobada por el usuario para la Entrega 1.

Estas reglas condensan las instrucciones de los documentos del curso y de la Guía SDD de la Entrega 1. Si otro requisito las contradice, registrar la discrepancia y resolverla antes de implementar.

## Arquitectura y dependencias

- La solución usa microservicios Node.js/NestJS, React, MongoDB y Docker Compose.
- Cada servicio mantiene su propia base de datos y se comunica con otros servicios solo mediante API REST/JSON. Ningún servicio consulta la base de otro.
- El frontend solo se comunica con el API Gateway.
- Cada servicio aplica arquitectura hexagonal: `infrastructure → application → domain`. El dominio no importa NestJS, Express, Mongoose ni dependencias externas.
- Los casos de uso dependen de puertos; los adaptadores concretos se conectan mediante inyección de dependencias.
- Aplicar SOLID y mantener responsabilidades e interfaces pequeñas.

## Seguridad y calidad

- Solo se aceptan correos `@correounivalle.edu.co`, sin distinguir mayúsculas/minúsculas. Rechazar otro dominio antes de consultar la base de datos.
- Contraseñas almacenadas con bcrypt; secretos fuera del repositorio, mediante variables de entorno y `.env.example` versionado.
- No registrar contraseñas ni tokens. Las credenciales inválidas producen un mensaje genérico.
- Cada criterio de aceptación tendrá pruebas asociadas. Mantener especificación, pruebas e implementación alineadas.
- No implementar requisitos ausentes de la especificación: proponer una enmienda o solicitar aclaración.

## Flujo de trabajo

1. Especificar requisitos y criterios Dado/Cuando/Entonces.
2. Diseñar puertos, adaptadores, contratos y datos.
3. Dividir el trabajo en tareas verificables.
4. Implementar y probar según la especificación aprobada.
5. Verificar y actualizar especificación si cambia el alcance.

Trabajar en cambios pequeños y documentar avances. La guía propone commits convencionales, Jira y entregas semanales mediante PR de GitHub; las operaciones externas se harán cuando estén disponibles y solicitadas.

## Alcance de Entrega 1 según la guía

- Funcional: autenticación, API Gateway que enruta autenticación y frontend.
- UI con datos mock: catálogo, detalle, búsqueda, recomendados, carrito, pedidos y pago.
- Fuera de alcance: backends de catálogo/pedidos/pagos/búsqueda/recomendación, pasarela real, Kubernetes y recuperación de contraseña.
- Contenedores: `users-db`, `auth-service`, `api-gateway` y `frontend`.

## Discrepancia pendiente

La primera página de la guía enumera “registro de usuarios desde la UI (solo funcional)” dentro de lo que se debe construir; la sección de alcance detallado, el prompt maestro y la hoja de ruta ubican el registro de usuarios en la Entrega 2. Para evitar ampliar el alcance contradictoriamente, el usuario aprobó excluir el registro de Entrega 1 y limitarse al login descrito en la sección 6.

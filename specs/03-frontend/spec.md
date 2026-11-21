# Especificación: frontend de Univalle Shop

<<<<<<< HEAD
**Estado:** aprobada por el usuario para la Entrega 1.
=======
**Estado:** propuesta para revisión; aún no aprobada.
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)

## Alcance

React, Vite, TypeScript y React Router. Login real a través del Gateway. Las demás áreas son UI navegable respaldada por datos mock: inicio/catálogo, producto, búsqueda local, recomendados, carrito, pedidos y formulario de pago simulado. No integrar pagos reales ni backends futuros.

## Requisitos y aceptación

- **FE-01:** `/login` valida correo institucional y contraseña no vacía antes del envío y presenta errores junto a los campos.
- **FE-02:** el login se comunica con el Gateway; mostrar estados de carga, error de credenciales, dominio inválido y servicio caído.
- **FE-03:** en éxito, conservar el token en memoria y `sessionStorage`, cargar `/auth/me` y redirigir a `/`.
- **FE-04:** cerrar sesión limpia token y estado de usuario.
- **FE-05:** todas las rutas excepto `/login` requieren sesión; sin token se redirige al login.
- **FE-06:** catálogo, detalle, búsqueda, recomendados, carrito, pedidos y pago se pueden navegar con sesión activa y datos mock.
- **FE-07:** cada módulo usa un puerto de repositorio y adaptador mock, aislando datos de la UI para permitir reemplazo posterior por HTTP.
- **FE-08:** diseño responsive y móvil primero, fondo blanco, texto negro, navegación oscura, acento rojo `#D90429`, foco visible, navegación por teclado y contraste AA.

## Rutas

`/login`, `/`, `/producto/:id`, `/buscar?q=`, `/recomendados`, `/carrito`, `/pedidos` y `/pago`.

## Diseño visual

Usar los tokens definidos por la guía: blanco `#FFFFFF`, negro `#0A0A0A`, grises `#F5F5F5`, `#D4D4D4`, `#525252`, rojo `#D90429`, hover `#A30320`, radio 12px, sombra suave y tipografía Inter con fallback del sistema. Botón primario rojo con transición y estados hover/active/focus; botón secundario invertible; tarjetas con borde y elevación discreta.

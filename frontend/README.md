# Frontend

Aplicación React + Vite. El login consume el Gateway; catálogo, filtros, recomendaciones, carrito y checkout usan datos/estado local.

## Configuración

`VITE_API_URL` es la URL pública del Gateway, por defecto `http://localhost:8080/api`. En Docker se configura como argumento de build, porque Vite incorpora esta variable al bundle estático.

## Desarrollo

Desde la raíz del monorepo ejecuta `npm install` y luego `npm run dev:frontend`. La aplicación inicia en el puerto 5173 en modo desarrollo. Las rutas privadas requieren un JWT válido.

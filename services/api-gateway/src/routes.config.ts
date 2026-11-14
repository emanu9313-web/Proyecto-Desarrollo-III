export const routesConfig = {
  '/api/auth/*': process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001',
  // Los servicios de catálogo, pedidos y pagos se habilitarán en otra entrega.
} as const;

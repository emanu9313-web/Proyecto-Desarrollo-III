export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('univalle.accessToken');
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message ?? 'No fue posible completar la solicitud') as Error & { status: number; code?: string };
    error.status = response.status;
    error.code = payload.code;
    throw error;
  }
  return payload as T;
}

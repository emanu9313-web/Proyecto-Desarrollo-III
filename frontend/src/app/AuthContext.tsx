import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, API_URL } from '../shared/api-client';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'STAFF';
}

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('univalle.accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    apiRequest<CurrentUser>('/auth/me')
      .then(setUser)
      .catch(() => sessionStorage.removeItem('univalle.accessToken'))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.message ?? 'No fue posible iniciar sesión') as Error & { status: number; code?: string };
      error.status = response.status;
      error.code = result.code;
      throw error;
    }
    sessionStorage.setItem('univalle.accessToken', result.accessToken);
    try {
      const current = await apiRequest<CurrentUser>('/auth/me');
      setUser(current);
    } catch (error) {
      sessionStorage.removeItem('univalle.accessToken');
      throw error;
    }
  }

  function signOut() {
    sessionStorage.removeItem('univalle.accessToken');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}

import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation } from 'wouter';

export function useAuthGuard() {
  const token = useAuthStore(state => state.token);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) {
      setLocation('/login');
    }
  }, [token, setLocation]);

  return { isAuthenticated: !!token };
}

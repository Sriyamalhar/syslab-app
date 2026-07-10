import { create } from 'zustand';
import type { User } from '@workspace/api-client-react';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('syslab_token'),
  user: (() => {
    try {
      const u = localStorage.getItem('syslab_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  setAuth: (token, user) => {
    localStorage.setItem('syslab_token', token);
    localStorage.setItem('syslab_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('syslab_token');
    localStorage.removeItem('syslab_user');
    set({ token: null, user: null });
  },
  isAuthenticated: () => !!get().token,
}));

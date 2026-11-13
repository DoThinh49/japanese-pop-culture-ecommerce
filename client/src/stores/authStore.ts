import { create } from 'zustand';
import api from '../lib/api';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  avatarUrl?: string | null;
  otakuPoints: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    set({ user, token: accessToken, isLoading: false });
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    const { user, accessToken } = res.data.data;
    localStorage.setItem('accessToken', accessToken);
    set({ user, token: accessToken, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      set({ user: null, token: null, isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        set({ user: null, token: null, isLoading: false });
        return;
      }
      const res = await api.get('/auth/me');
      set({ user: res.data.data, token, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));


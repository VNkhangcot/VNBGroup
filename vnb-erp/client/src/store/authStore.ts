import { create } from 'zustand';
import { User, TenantConfig } from '../types';
import { api } from '../api/client';
import { useModuleStore } from './moduleStore';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: {
    storeName: string;
    storePhone?: string;
    fullName: string;
    username: string;
    email?: string;
    password: string;
    pinCode?: string;
  }) => Promise<boolean>;
  pinLogin: (userId: string, pinCode: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;

  // Role Checks
  isSuperAdmin: () => boolean;
  isOwner: () => boolean;
  canAccessSettings: () => boolean;
  canAccessAnalytics: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('vnb_auth_token'),
  isAuthenticated: Boolean(localStorage.getItem('vnb_auth_token')),
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.login(identifier, password);
      localStorage.setItem('vnb_auth_token', data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Update tenant in moduleStore if present
      if (data.tenant) {
        useModuleStore.getState().setTenant(data.tenant);
      }
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Đăng nhập thất bại',
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  },

  register: async (registerData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.register(registerData);
      localStorage.setItem('vnb_auth_token', data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      if (data.tenant) {
        useModuleStore.getState().setTenant(data.tenant);
      }
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Đăng ký thất bại',
        isLoading: false,
      });
      return false;
    }
  },

  pinLogin: async (userId, pinCode) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.pinLogin(userId, pinCode);
      localStorage.setItem('vnb_auth_token', data.token);
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      if (data.tenant) {
        useModuleStore.getState().setTenant(data.tenant);
      }
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Xác thực mã PIN thất bại',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('vnb_auth_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('vnb_auth_token');
    if (!token) {
      set({ isAuthenticated: false, isLoading: false, user: null });
      return;
    }

    try {
      set({ isLoading: true });
      const data = await api.getMe();
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      if (data.tenant) {
        useModuleStore.getState().setTenant(data.tenant);
      }
    } catch (err: any) {
      console.warn('Auth token expired or invalid:', err);
      localStorage.removeItem('vnb_auth_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message || null,
      });
    }
  },

  isSuperAdmin: () => {
    const user = get().user;
    return user?.role === 'superadmin';
  },

  isOwner: () => {
    const user = get().user;
    return user?.role === 'owner' || user?.role === 'superadmin';
  },

  canAccessSettings: () => {
    const user = get().user;
    return user?.role === 'owner' || user?.role === 'manager' || user?.role === 'superadmin';
  },

  canAccessAnalytics: () => {
    const user = get().user;
    return user?.role === 'owner' || user?.role === 'manager' || user?.role === 'superadmin';
  },
}));

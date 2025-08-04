import { create } from 'zustand';
import { authService, AuthResponse, LoginCredentials } from '@/services/authService';
import { menteeAPI } from '@/services/menteeAPI';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await menteeAPI.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await menteeAPI.register(userData);
      set({
        user: response.user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        loading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await menteeAPI.logout();
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      // Even if logout API fails, clear local state
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  checkAuthStatus: async () => {
    set({ loading: true });
    try {
      await authService.initialize();
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        // You might want to fetch user data here if needed
        // const user = await menteeAPI.getCurrentUser();
        set({
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Auth check failed',
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

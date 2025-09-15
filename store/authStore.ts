import { create } from 'zustand';
import { authService, AuthResponse, LoginCredentials } from '@/services/authService';
import { menteeAPI } from '@/services/menteeAPI';

interface User {
  userId: string;
  id?: string;
  email?: string;
  name?: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: { name: string; email: string; birthdate: string; phoneNumber?: string; username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  
  // Getters
  getCurrentUser: () => User | null;
  getUserId: () => string | null;
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
      
      // Decode JWT to get user information
      const userInfo = await authService.getUserFromToken();
      console.log('👤 User info from token:', userInfo);
      
      if (userInfo) {
        set({
          user: {
            userId: userInfo.userId
          },
          isAuthenticated: true,
          loading: false,
        });
      } else {
        // Fallback if we can't decode the token
        set({
          user: null,
          isAuthenticated: true,
          loading: false,
        });
      }
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
      // Registration successful, but user needs to login to get tokens
      set({
        isAuthenticated: false, // User needs to login after registration
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
    set({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },

  checkAuthStatus: async () => {
    set({ loading: true });
    try {
      await authService.initialize();
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        // Decode JWT to get user information
        const userInfo = await authService.getUserFromToken();
        
        if (userInfo) {
          set({
            user: {
              userId: userInfo.userId
            },
            isAuthenticated: true,
            loading: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: true,
            loading: false,
          });
        }
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
  
  // Getters
  getCurrentUser: () => get().user,
  getUserId: () => get().user?.userId || null,
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { AuthState, User, AuthResponse } from '../types/auth';
import { getApiUrl } from '../utils/environment';
import { setAuthToken } from '../services/api';

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user: User | null, token: string | null) => {
        set({ 
          user, 
          token, 
          isAuthenticated: !!user && !!token 
        });
        
        // Update auth token in both API instances
        setAuthToken(token);
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete api.defaults.headers.common['Authorization'];
        }
      },

      initializeAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          const user = response.data;
          set({ user, isAuthenticated: true });
          setAuthToken(token); // Ensure main API client also has the token
        } catch (error: any) {
          console.error('Auth initialization failed:', error.response?.status, error.response?.data);
          // Clear invalid token
          get().setUser(null, null);
          // Only redirect if we're not already on an auth page
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
          }
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password,
          });
          
          const { user, token } = response.data;
          get().setUser(user, token);
        } catch (error: any) {
          console.error('Login failed:', error);
          throw new Error(error.response?.data?.error || 'Login failed');
        } finally {
          set({ isLoading: false });
        }
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          // For now, just validate the current token
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          const user = response.data;
          set({ user, isAuthenticated: true });
          setAuthToken(token);
          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().setUser(null, null);
          return false;
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/signup', {
            email,
            password,
            name,
          });
          
          const { user, token } = response.data;
          get().setUser(user, token);
        } catch (error: any) {
          console.error('Signup failed:', error);
          throw new Error(error.response?.data?.error || 'Signup failed');
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithGoogle: () => {
        window.location.href = `${getApiUrl()}/auth/google`;
      },

      logout: async () => {
        const { token } = get();
        if (token) {
          try {
            await api.post('/auth/logout');
          } catch (error) {
            console.error('Logout request failed:', error);
          }
        }
        
        get().setUser(null, null);
      },

      devLogin: async () => {
        if (import.meta.env.MODE === 'production') {
          throw new Error('Development login not available in production');
        }
        
        set({ isLoading: true });
        try {
          const response = await api.post<AuthResponse>('/auth/dev-login');
          const { user, token } = response.data;
          get().setUser(user, token);
        } catch (error: any) {
          console.error('Dev login failed:', error);
          throw new Error(error.response?.data?.error || 'Dev login failed');
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// Export the configured axios instance for use in other services
export { api };
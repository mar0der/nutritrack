import axios from 'axios';
import { type Ingredient, type Dish, type ConsumptionLog, type Recommendation, type CreateIngredientForm, type CreateDishForm, type CreateConsumptionLogForm } from '../types';
import { getApiUrl, shouldUseHttps } from '../utils/environment';

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true,
  // Ensure HTTPS is used in production
  httpsAgent: typeof window === 'undefined' ? undefined : null,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const protocol = shouldUseHttps() ? 'HTTPS' : 'HTTP';
    console.log(`API Request (${protocol}): ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Only auto-redirect if this is NOT an auth/me request (which is handled by auth store)
      const isAuthCheck = error.config?.url?.includes('/auth/me');
      
      if (!isAuthCheck) {
        // Clear token and redirect to login if not already on auth pages
        setAuthToken(null);
        localStorage.removeItem('auth-storage');
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle specific HTTPS/SSL errors
    if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'CERT_UNTRUSTED') {
      console.warn('SSL Certificate issue detected. Using self-signed certificate.');
    }
    
    if (error.code === 'ECONNREFUSED' && window.location.protocol === 'https:') {
      console.error('HTTPS connection failed. Check if server supports HTTPS.');
    }
    
    return Promise.reject(error);
  }
);

// Ingredients API
export const ingredientsApi = {
  getAll: (params?: { search?: string; category?: string }) => 
    api.get<Ingredient[]>('/ingredients', { params }),
  
  getById: (id: string) => 
    api.get<Ingredient>(`/ingredients/${id}`),
  
  create: (data: CreateIngredientForm) => 
    api.post<Ingredient>('/ingredients', data),
  
  update: (id: string, data: Partial<CreateIngredientForm>) => 
    api.put<Ingredient>(`/ingredients/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/ingredients/${id}`),
};

// Dishes API
export const dishesApi = {
  getAll: (params?: { search?: string }) => 
    api.get<Dish[]>('/dishes', { params }),
  
  getById: (id: string) => 
    api.get<Dish>(`/dishes/${id}`),
  
  create: (data: CreateDishForm) => 
    api.post<Dish>('/dishes', data),
  
  update: (id: string, data: Partial<CreateDishForm>) => 
    api.put<Dish>(`/dishes/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/dishes/${id}`),
};

// Consumption API
export const consumptionApi = {
  getAll: (params?: { days?: number }) => 
    api.get<ConsumptionLog[]>('/consumption', { params }),
  
  create: (data: CreateConsumptionLogForm) => 
    api.post<ConsumptionLog>('/consumption', data),
  
  getRecentIngredients: (params?: { days?: number }) => 
    api.get<string[]>('/consumption/recent-ingredients', { params }),
};

// Recommendations API
export const recommendationsApi = {
  get: (params?: { days?: number; limit?: number }) => 
    api.get<Recommendation[]>('/recommendations', { params }),
};

export default api;
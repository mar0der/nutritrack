import axios from 'axios';
import { type Ingredient, type Dish, type ConsumptionLog, type Recommendation, type CreateIngredientForm, type CreateDishForm, type CreateConsumptionLogForm } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
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
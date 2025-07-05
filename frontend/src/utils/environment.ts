// Environment utilities for HTTPS detection and configuration

export const isHttps = (): boolean => {
  return window.location.protocol === 'https:';
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

export const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If environment URL is set, use it
  if (envUrl) {
    return envUrl;
  }
  
  // In production or HTTPS environments, use relative path
  if (isProduction() || isHttps()) {
    return '/api';
  }
  
  // Development fallback
  return 'http://localhost:3001/api';
};

export const getBaseUrl = (): string => {
  if (isProduction()) {
    return window.location.origin;
  }
  
  return isHttps() ? 'https://localhost' : 'http://localhost:5173';
};

export const shouldUseHttps = (): boolean => {
  return isProduction() || isHttps();
};
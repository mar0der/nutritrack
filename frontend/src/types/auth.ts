export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'email' | 'google';
  emailVerified: boolean;
  preferences?: UserPreference;
}

export interface UserPreference {
  id: string;
  userId: string;
  avoidPeriodDays: number;
  dietaryRestrictions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  setUser: (user: User | null, token: string | null) => void;
  initializeAuth: () => Promise<void>;
  devLogin: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
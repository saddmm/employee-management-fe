import api from './axios';
import type { ApiResponse, User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginData> => {
    const res = await api.post<ApiResponse<LoginData>>('/api/auth/login', credentials);
    return res.data.data;
  },

  register: async (credentials: RegisterCredentials): Promise<LoginData> => {
    const res = await api.post<ApiResponse<LoginData>>('/api/auth/register', credentials);
    return res.data.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/api/auth/me');
    return res.data.data;
  },
};

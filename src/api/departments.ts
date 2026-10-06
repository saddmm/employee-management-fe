import api from './axios';
import type { ApiResponse, Department } from '../types';

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name: string;
  description?: string;
}

export const departmentApi = {
  getAll: async (): Promise<Department[]> => {
    const res = await api.get<ApiResponse<Department[]>>('/api/departments');
    return res.data.data;
  },

  getById: async (id: number): Promise<Department> => {
    const res = await api.get<ApiResponse<Department>>(`/api/departments/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateDepartmentPayload): Promise<Department> => {
    const res = await api.post<ApiResponse<Department>>('/api/departments', payload);
    return res.data.data;
  },

  update: async (id: number, payload: UpdateDepartmentPayload): Promise<Department> => {
    const res = await api.put<ApiResponse<Department>>(`/api/departments/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/departments/${id}`);
  },
};

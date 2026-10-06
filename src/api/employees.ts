import api from './axios';
import type { ApiResponse, Employee, EmployeeFilterParams } from '../types';

export interface CreateEmployeePayload {
  name: string;
  email: string;
  phone?: string;
  position: string;
  department_id?: number | null;
  status: 'active' | 'inactive';
  joined_at?: string;
}

export interface UpdateEmployeePayload {
  name: string;
  email: string;
  phone?: string;
  position: string;
  department_id?: number | null;
  status: 'active' | 'inactive';
  joined_at?: string;
}

export const employeeApi = {
  getAll: async (params?: EmployeeFilterParams): Promise<ApiResponse<Employee[]>> => {
    const res = await api.get<ApiResponse<Employee[]>>('/api/employees', { params });
    return res.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const res = await api.get<ApiResponse<Employee>>(`/api/employees/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateEmployeePayload): Promise<Employee> => {
    const res = await api.post<ApiResponse<Employee>>('/api/employees', payload);
    return res.data.data;
  },

  update: async (id: number, payload: UpdateEmployeePayload): Promise<Employee> => {
    const res = await api.put<ApiResponse<Employee>>(`/api/employees/${id}`, payload);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/employees/${id}`);
  },

  exportCsv: async (params?: Partial<EmployeeFilterParams>): Promise<Blob> => {
    const res = await api.get('/api/employees/export/csv', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },
};

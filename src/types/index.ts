export type Role = 'admin' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type EmployeeStatus = 'active' | 'inactive';

export interface Employee {
  id: number;
  department_id?: number | null;
  department?: Department | null;
  name: string;
  email: string;
  phone?: string;
  position: string;
  status: EmployeeStatus;
  joined_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number | null;
  user?: User | null;
  entity: string;
  entity_id: number;
  action: 'create' | 'update' | 'delete';
  old_data?: string;
  new_data?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  errors?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface EmployeeFilterParams {
  search?: string;
  department_id?: number | string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

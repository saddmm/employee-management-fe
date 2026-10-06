import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  employeeApi,
  type CreateEmployeePayload,
  type UpdateEmployeePayload,
} from '../api/employees';
import type { EmployeeFilterParams } from '../types';

export const EMPLOYEE_QUERY_KEY = ['employees'];

export function useEmployees(params?: EmployeeFilterParams) {
  const queryClient = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: [...EMPLOYEE_QUERY_KEY, params],
    queryFn: () => employeeApi.getAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEmployeePayload }) =>
      employeeApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeeApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEY });
      queryClient.removeQueries({ queryKey: ['employee', id] });
    },
  });

  return {
    employees: employeesQuery.data?.data || [],
    meta: employeesQuery.data?.meta,
    isLoading: employeesQuery.isLoading,
    error: employeesQuery.error,
    refetch: employeesQuery.refetch,
    createEmployee: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEmployee: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEmployee: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useEmployeeDetail(id: number | null) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => (id ? employeeApi.getById(id) : null),
    enabled: !!id,
    staleTime: 0, // Always fetch fresh data so update form always has the latest info
  });
}

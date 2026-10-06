import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentApi, type CreateDepartmentPayload, type UpdateDepartmentPayload } from '../api/departments';

export const DEPARTMENT_QUERY_KEY = ['departments'];

export function useDepartments() {
  const queryClient = useQueryClient();

  const departmentsQuery = useQuery({
    queryKey: DEPARTMENT_QUERY_KEY,
    queryFn: departmentApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateDepartmentPayload) => departmentApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateDepartmentPayload }) =>
      departmentApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEY });
    },
  });

  return {
    departments: departmentsQuery.data || [],
    isLoading: departmentsQuery.isLoading,
    error: departmentsQuery.error,
    createDepartment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateDepartment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteDepartment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/usersApi';
import { toast } from 'sonner';

export function useUsersList(params) {
  return useQuery({
    queryKey: ['users', 'list', params],
    queryFn: () => usersApi.getList(params),
  });
}

export function useUserDetail(id) {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => usersApi.getDetail(id),
    enabled: !!id,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usersApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
      toast.success('Estado del usuario actualizado');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el estado');
    },
  });
}

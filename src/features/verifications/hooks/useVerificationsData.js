import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { verificationsApi } from '../services/verificationsApi';
import { toast } from 'sonner';

export function useVerificationsList(params) {
  return useQuery({
    queryKey: ['verifications', 'list', params],
    queryFn: () => verificationsApi.getList(params),
  });
}

export function useVerificationDetail(id) {
  return useQuery({
    queryKey: ['verifications', 'detail', id],
    queryFn: () => verificationsApi.getDetail(id),
    enabled: !!id,
  });
}

export function useApproveVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => verificationsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications', 'list'] });
      toast.success('Verificación aprobada');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al aprobar');
    },
  });
}

export function useRejectVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => verificationsApi.reject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications', 'list'] });
      toast.success('Verificación rechazada');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al rechazar');
    },
  });
}

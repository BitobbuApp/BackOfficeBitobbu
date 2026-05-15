import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { plansCatalogApi } from '../services/plansCatalogApi';
import { toast } from 'sonner';

export function usePlansCatalogList(params) {
  return useQuery({
    queryKey: ['plans', 'list', params],
    queryFn: () => plansCatalogApi.getList(params),
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => plansCatalogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list'] });
      toast.success('Plan creado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al crear el plan');
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => plansCatalogApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list'] });
      toast.success('Plan actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el plan');
    },
  });
}

export function useUpdatePlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => plansCatalogApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans', 'list'] });
      toast.success('Estado del plan actualizado');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el estado del plan');
    },
  });
}

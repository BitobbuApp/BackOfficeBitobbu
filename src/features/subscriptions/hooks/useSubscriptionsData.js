import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../services/subscriptionsApi';
import { toast } from 'sonner';

export function useSubscriptionsList(params) {
  return useQuery({
    queryKey: ['subscriptions', 'list', params],
    queryFn: () => subscriptionsApi.getList(params),
  });
}

export function useChangeSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, data }) => subscriptionsApi.changePlan(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'list'] });
      toast.success('Plan actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el plan');
    },
  });
}

export function useExtendSubscriptionDays() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, data }) => subscriptionsApi.extendDays(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'list'] });
      toast.success('Días de suscripción extendidos correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al extender los días');
    },
  });
}

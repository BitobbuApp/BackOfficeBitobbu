import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '../services/subscriptionsApi';
import { toast } from 'sonner';

export function useSubscriptionsList(params) {
  return useQuery({
    queryKey: ['subscriptions', 'list', params],
    queryFn: () => subscriptionsApi.getList(params),
  });
}

export function useSubscriptionHistory(companyId) {
  return useQuery({
    queryKey: ['subscriptions', 'history', companyId],
    queryFn: () => subscriptionsApi.getHistory(companyId),
    enabled: !!companyId,
  });
}

function useInvalidateSubscriptions() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
}

export function useChangeSubscriptionPlan() {
  const invalidate = useInvalidateSubscriptions();

  return useMutation({
    mutationFn: ({ companyId, data }) => subscriptionsApi.changePlan(companyId, data),
    onSuccess: () => {
      invalidate();
      toast.success('Plan actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el plan');
    },
  });
}

export function useExtendSubscriptionDays() {
  const invalidate = useInvalidateSubscriptions();

  return useMutation({
    mutationFn: ({ companyId, data }) => subscriptionsApi.extendDays(companyId, data),
    onSuccess: () => {
      invalidate();
      toast.success('Días de suscripción extendidos correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al extender los días');
    },
  });
}

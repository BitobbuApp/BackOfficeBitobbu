import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subscriptionPaymentsApi } from '../services/subscriptionPaymentsApi';

export function useSubscriptionPaymentsList(params) {
  return useQuery({
    queryKey: ['subscription-payments', 'list', params],
    queryFn: () => subscriptionPaymentsApi.getList(params),
  });
}

function useReviewMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-payments'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success(successMessage);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'No se pudo procesar el pago');
    },
  });
}

export function useApprovePayment() {
  return useReviewMutation((id) => subscriptionPaymentsApi.approve(id), 'Pago aprobado y plan activado');
}

export function useRejectPayment() {
  return useReviewMutation(({ id, reason }) => subscriptionPaymentsApi.reject(id, reason), 'Pago rechazado');
}

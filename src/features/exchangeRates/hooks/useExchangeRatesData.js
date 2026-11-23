import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { exchangeRatesApi } from '../services/exchangeRatesApi';

const QUERY_KEY = ['exchange-rates'];

export function useExchangeRates(params) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => exchangeRatesApi.getList(params),
  });
}

export function useSetDailyRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => exchangeRatesApi.setDaily(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Tasa guardada');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'No se pudo guardar la tasa');
    },
  });
}

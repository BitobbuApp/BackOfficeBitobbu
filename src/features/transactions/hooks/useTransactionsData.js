import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../services/transactionsApi';

export function useTransactionsList(params) {
  return useQuery({
    queryKey: ['transactions', 'list', params],
    queryFn: () => transactionsApi.getList(params),
  });
}

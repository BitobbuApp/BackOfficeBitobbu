import { useQuery } from '@tanstack/react-query';
import { rfqsApi } from '../services/rfqsApi';

export function useRfqsList(params) {
  return useQuery({
    queryKey: ['rfqs', 'list', params],
    queryFn: () => rfqsApi.getList(params),
  });
}

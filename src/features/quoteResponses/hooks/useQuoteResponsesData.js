import { useQuery } from '@tanstack/react-query';
import { quoteResponsesApi } from '../services/quoteResponsesApi';

export function useQuoteResponsesList(params) {
  return useQuery({
    queryKey: ['quoteResponses', 'list', params],
    queryFn: () => quoteResponsesApi.getList(params),
  });
}

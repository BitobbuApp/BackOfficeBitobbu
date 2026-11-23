import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboardApi';

export function useDashboardKpis() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: () => dashboardApi.getKpis(),
  });
}

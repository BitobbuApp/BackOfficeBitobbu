import apiClient from '@/api/axiosClient';
import { dashboardKpisResponseSchema } from '../schemas/dashboard.schema';

export const dashboardApi = {
  async getKpis() {
    const response = await apiClient.get('/admin/dashboard/kpis');
    return dashboardKpisResponseSchema.parse(response);
  },
};

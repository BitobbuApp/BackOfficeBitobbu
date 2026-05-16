import apiClient from '@/api/axiosClient';
import { rfqItemSchema, rfqsListResponseSchema } from '../schemas/rfqs.schema';

export const rfqsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/rfqs', { params });
    if (Array.isArray(response.data)) {
      return { items: response.data.map(item => rfqItemSchema.parse(item)) };
    }
    return rfqsListResponseSchema.parse(response.data);
  },

  async exportList(params) {
    return apiClient.get('/admin/rfqs/export', {
      params,
      responseType: 'blob',
    });
  },
};

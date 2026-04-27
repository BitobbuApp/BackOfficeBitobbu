import apiClient from '@/api/axiosClient';
import { rfqItemSchema, rfqsListResponseSchema } from '../schemas/rfqs.schema';

export const rfqsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/rfqs', { params });
    if (Array.isArray(response)) {
      return { items: response.map(item => rfqItemSchema.parse(item)) };
    }
    return rfqsListResponseSchema.parse(response);
  },
};

import apiClient from '@/api/axiosClient';
import { quoteResponseItemSchema, quoteResponsesListResponseSchema } from '../schemas/quoteResponses.schema';

export const quoteResponsesApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/quote-responses', { params });
    if (Array.isArray(response.data)) {
      return { items: response.data.map(item => quoteResponseItemSchema.parse(item)) };
    }
    return quoteResponsesListResponseSchema.parse(response.data);
  },

  async exportList(params) {
    return apiClient.get('/admin/quote-responses/export', {
      params,
      responseType: 'blob',
    });
  },
};

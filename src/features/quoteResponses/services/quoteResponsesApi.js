import apiClient from '@/api/axiosClient';
import { quoteResponseItemSchema, quoteResponsesListResponseSchema } from '../schemas/quoteResponses.schema';

export const quoteResponsesApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/quote-responses', { params });
    if (Array.isArray(response)) {
      return { items: response.map(item => quoteResponseItemSchema.parse(item)) };
    }
    return quoteResponsesListResponseSchema.parse(response);
  },
};

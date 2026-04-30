import apiClient from '@/api/axiosClient';
import { transactionItemSchema, transactionsListResponseSchema } from '../schemas/transactions.schema';

export const transactionsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/transactions', { params });
    if (Array.isArray(response.data)) {
      return { items: response.data.map(item => transactionItemSchema.parse(item)) };
    }
    return transactionsListResponseSchema.parse(response.data);
  },
};

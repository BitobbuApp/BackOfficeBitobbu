import apiClient from '@/api/axiosClient';
import { paymentsListResponseSchema } from '../schemas/subscriptionPayments.schema';

export const subscriptionPaymentsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/subscription-payments', { params });
    return paymentsListResponseSchema.parse(response?.data ?? { items: [] });
  },

  async getReceiptUrl(id) {
    const response = await apiClient.get(`/admin/subscription-payments/${id}/receipt`);
    return response?.data?.url;
  },

  async approve(id) {
    return apiClient.post(`/admin/subscription-payments/${id}/approve`);
  },

  async reject(id, reason) {
    return apiClient.post(`/admin/subscription-payments/${id}/reject`, { reason });
  },
};

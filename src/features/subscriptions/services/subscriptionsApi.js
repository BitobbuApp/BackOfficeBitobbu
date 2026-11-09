import apiClient from '@/api/axiosClient';
import { subscriptionHistorySchema, subscriptionsListResponseSchema } from '../schemas/subscriptions.schema';

export const subscriptionsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/subscriptions', { params });
    return subscriptionsListResponseSchema.parse(response?.data ?? { items: [] });
  },

  async getHistory(companyId) {
    const response = await apiClient.get(`/admin/subscriptions/${companyId}/history`);
    return subscriptionHistorySchema.parse(response?.data ?? []);
  },

  async changePlan(companyId, { plan_code, reason }) {
    return apiClient.patch(`/admin/subscriptions/${companyId}/plan`, { plan_code, reason });
  },

  async extendDays(companyId, { days, reason }) {
    return apiClient.patch(`/admin/subscriptions/${companyId}/extend-days`, { days, reason });
  },
};

import apiClient from '@/api/axiosClient';
import { subscriptionItemSchema, subscriptionsListResponseSchema } from '../schemas/subscriptions.schema';

export const subscriptionsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/subscriptions', { params });
    // Handle array or paginated object structure
    if (Array.isArray(response)) {
      return { items: response.map(item => subscriptionItemSchema.parse(item)) };
    }

    // In case the paginated structure has an array directly or inside items
    if (response.items) {
      return subscriptionsListResponseSchema.parse(response);
    }

    return { items: [] };
  },

  async changePlan(companyId, { plan_code, reason }) {
    return apiClient.patch(`/admin/subscriptions/${companyId}/plan`, { plan_code, reason });
  },

  async extendDays(companyId, { days, reason }) {
    return apiClient.patch(`/admin/subscriptions/${companyId}/extend-days`, { days, reason });
  },
};

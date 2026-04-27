import apiClient from '@/api/axiosClient';
import { planItemSchema, plansListResponseSchema } from '../schemas/plansCatalog.schema';

export const plansCatalogApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/plans', { params });
    if (Array.isArray(response)) {
      return { items: response.map(item => planItemSchema.parse(item)) };
    }
    if (response.items) {
      return plansListResponseSchema.parse(response);
    }
    return { items: [] };
  },

  async create(data) {
    const response = await apiClient.post('/admin/plans', data);
    return response;
  },

  async update(id, data) {
    const response = await apiClient.patch(`/admin/plans/${id}`, data);
    return response;
  },

  async updateStatus(id, { status, reason }) {
    const response = await apiClient.patch(`/admin/plans/${id}/status`, { status, reason });
    return response;
  },
};

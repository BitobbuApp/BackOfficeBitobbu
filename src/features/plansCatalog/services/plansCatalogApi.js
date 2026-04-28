import apiClient from '@/api/axiosClient';
import { planItemSchema, plansListResponseSchema } from '../schemas/plansCatalog.schema';

export const plansCatalogApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/plans', { params });
    // response.data is the flat array according to the payload
    const items = plansListResponseSchema.parse(response.data);
    return { items };
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

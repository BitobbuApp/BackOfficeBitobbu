import apiClient from '@/api/axiosClient';
import { lookupsListResponseSchema } from '../schemas/lookups.schema';

export const lookupsApi = {
  async getList(tableKey) {
    const response = await apiClient.get(`/admin/lookups/${tableKey}`);

    // Sometimes backend wraps array in { items: [] } or just returns array
    if (Array.isArray(response)) {
      return lookupsListResponseSchema.parse(response);
    }
    if (response.items) {
      return lookupsListResponseSchema.parse(response.items);
    }

    return [];
  },

  async create(tableKey, data) {
    const response = await apiClient.post(`/admin/lookups/${tableKey}`, data);
    return response;
  },

  async update(tableKey, id, data) {
    const response = await apiClient.patch(`/admin/lookups/${tableKey}/${id}`, data);
    return response;
  },

  async updateStatus(tableKey, id, { is_active }) {
    // Some endpoints use status, others is_active. Documentation uses status for lookups
    const response = await apiClient.patch(`/admin/lookups/${tableKey}/${id}/status`, { is_active });
    return response;
  },
};

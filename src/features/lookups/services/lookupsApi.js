import apiClient from '@/api/axiosClient';
import { lookupsListResponseSchema } from '../schemas/lookups.schema';

export const lookupsApi = {
  async getList(tableConfig) {
    const response = await apiClient.get(tableConfig.endpoint);
    const data = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
        ? response
        : Array.isArray(response?.items)
          ? response.items
          : [];

    return lookupsListResponseSchema.parse(data);
  },

  async create(tableConfig, data) {
    return apiClient.post(tableConfig.endpoint, data);
  },

  async update(tableConfig, id, data) {
    return apiClient.patch(`${tableConfig.endpoint}/${id}`, data);
  },

  async updateStatus(tableConfig, id, { is_active }) {
    return apiClient.patch(`${tableConfig.endpoint}/${id}/status`, { is_active });
  },
};

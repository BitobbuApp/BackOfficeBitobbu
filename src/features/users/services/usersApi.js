import apiClient from '@/api/axiosClient';
import { userDetailResponseSchema, usersListResponseSchema } from '../schemas/users.schema';

export const usersApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/users', { params });
    return usersListResponseSchema.parse(response.data);
  },

  async getDetail(id) {
    const response = await apiClient.get(`/admin/users/${id}`);
    return userDetailResponseSchema.parse(response.data);
  },

  async updateStatus(id, { status, reason }) {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status, reason });
    return response;
  },

  async exportList(params) {
    const response = await apiClient.get('/admin/users/export', {
      params,
      responseType: 'blob',
    });
    return response;
  },
};

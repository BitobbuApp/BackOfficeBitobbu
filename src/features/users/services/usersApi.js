import apiClient from '@/api/axiosClient';
import { userDetailResponseSchema, usersListResponseSchema } from '../schemas/users.schema';

export const usersApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/users', { params });
    return usersListResponseSchema.parse(response);
  },

  async getDetail(id) {
    const response = await apiClient.get(`/admin/users/${id}`);
    return userDetailResponseSchema.parse(response);
  },

  async updateStatus(id, { status, reason }) {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status, reason });
    return response;
  },
};

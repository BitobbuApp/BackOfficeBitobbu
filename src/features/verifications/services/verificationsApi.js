import apiClient from '@/api/axiosClient';
import { verificationItemSchema, verificationsListResponseSchema } from '../schemas/verifications.schema';

export const verificationsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/verifications', { params });
    // Handle case where items are returned directly or inside a paginated structure
    if (Array.isArray(response)) {
      return { items: response.map(item => verificationItemSchema.parse(item)) };
    }
    return verificationsListResponseSchema.parse(response);
  },

  async getDetail(id) {
    const response = await apiClient.get(`/admin/verifications/${id}`);
    return verificationItemSchema.parse(response);
  },

  async approve(id) {
    return apiClient.patch(`/admin/verifications/${id}/approve`);
  },

  async reject(id, { reason }) {
    return apiClient.patch(`/admin/verifications/${id}/reject`, { reason });
  },
};

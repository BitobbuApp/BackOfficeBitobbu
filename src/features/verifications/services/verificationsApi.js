import apiClient from '@/api/axiosClient';
import { verificationItemSchema, verificationsListResponseSchema, companyDocumentSchema } from '../schemas/verifications.schema';

export const verificationsApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/verifications', { params });
    // Handle case where items are returned directly or inside a paginated structure
    if (Array.isArray(response.data)) {
      return { items: response.data.map(item => verificationItemSchema.parse(item)) };
    }
    return verificationsListResponseSchema.parse(response.data);
  },

  async getDocuments(companyId) {
    const response = await apiClient.get(`/admin/verifications/${companyId}/documents`);
    return response.data.map(doc => companyDocumentSchema.parse(doc));
  },

  async approve(id) {
    return apiClient.patch(`/admin/verifications/${id}/approve`);
  },

  async reject(id, { reason }) {
    return apiClient.patch(`/admin/verifications/${id}/reject`, { reason });
  },
};

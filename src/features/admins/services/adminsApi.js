import apiClient from '@/api/axiosClient';

export const adminsApi = {
  async getList() {
    const response = await apiClient.get('/admin/admins');
    // Assuming backend returns { data: [] } or just [] based on ApiResponse
    return response.data || response;
  },

  async create(data) {
    const response = await apiClient.post('/admin/admins', data);
    return response.data || response;
  },

  async update(id, data) {
    const response = await apiClient.patch(`/admin/admins/${id}`, data);
    return response.data || response;
  },

  async delete(id) {
    const response = await apiClient.delete(`/admin/admins/${id}`);
    return response.data || response;
  },
};

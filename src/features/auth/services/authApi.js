import apiClient from '@/api/axiosClient';
import { getMeResponseSchema, loginResponseSchema } from '../schemas/auth.schema';

export const authApi = {
  async login({ email, password }) {
    const response = await apiClient.post('/admin/auth/login', { email, password });
    return loginResponseSchema.parse(response.data);
  },

  async getMe() {
    const response = await apiClient.get('/admin/auth/me');
    return getMeResponseSchema.parse(response.data);
  },
};

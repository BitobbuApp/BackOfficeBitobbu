import apiClient from '@/api/axiosClient';
import { systemSettingsListSchema, systemSettingSchema } from '../schemas/systemSettings.schema';

export const systemSettingsApi = {
  async getList() {
    const response = await apiClient.get('/admin/settings');
    return systemSettingsListSchema.parse(response?.data ?? []);
  },

  async update(key, value) {
    const response = await apiClient.put(`/admin/settings/${key}`, { value });
    return systemSettingSchema.parse(response?.data);
  },

  async test(group, payload = {}) {
    return apiClient.post(`/admin/settings/test/${group}`, payload);
  },
};

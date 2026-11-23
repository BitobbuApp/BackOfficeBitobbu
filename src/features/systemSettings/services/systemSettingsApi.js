import apiClient from '@/api/axiosClient';
import { systemSettingsListSchema } from '../schemas/systemSettings.schema';

export const systemSettingsApi = {
  async getList() {
    const response = await apiClient.get('/admin/settings');
    return systemSettingsListSchema.parse(response?.data ?? []);
  },

  /** Saves several settings at once (all-or-nothing). values: { [key]: value } */
  async updateMany(values) {
    const response = await apiClient.put('/admin/settings', { values });
    return systemSettingsListSchema.parse(response?.data ?? []);
  },

  async test(group, payload = {}) {
    return apiClient.post(`/admin/settings/test/${group}`, payload);
  },
};

import apiClient from '@/api/axiosClient';
import { countriesListResponseSchema, statesListResponseSchema } from '../schemas/geography.schema';

export const geographyApi = {
  // Countries
  async getCountries() {
    const response = await apiClient.get('/admin/geography/countries');
    if (Array.isArray(response.data)) {
      return countriesListResponseSchema.parse(response.data);
    }
    return [];
  },

  async createCountry(data) {
    return apiClient.post('/admin/geography/countries', data);
  },

  async updateCountry(id, data) {
    return apiClient.patch(`/admin/geography/countries/${id}`, data);
  },

  async updateCountryStatus(id, { is_active }) {
    return apiClient.patch(`/admin/geography/countries/${id}/status`, { is_active });
  },

  // States
  async getStates(countryId) {
    const response = await apiClient.get('/admin/geography/states', { params: { country_id: countryId } });
    if (Array.isArray(response.data)) {
      return statesListResponseSchema.parse(response.data);
    }
    return [];
  },

  async createState(data) {
    return apiClient.post('/admin/geography/states', data);
  },

  async updateState(id, data) {
    return apiClient.patch(`/admin/geography/states/${id}`, data);
  },

  async updateStateStatus(id, { is_active }) {
    return apiClient.patch(`/admin/geography/states/${id}/status`, { is_active });
  },
};

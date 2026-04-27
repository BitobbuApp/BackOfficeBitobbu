import apiClient from '@/api/axiosClient';
import { countriesListResponseSchema, statesListResponseSchema } from '../schemas/geography.schema';

export const geographyApi = {
  // Countries
  async getCountries() {
    const response = await apiClient.get('/admin/geography/countries');
    if (Array.isArray(response)) {
      return countriesListResponseSchema.parse(response);
    }
    if (response.items) {
      return countriesListResponseSchema.parse(response.items);
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
  async getStates(countryCode) {
    const response = await apiClient.get('/admin/geography/states', { params: { country_code: countryCode } });
    if (Array.isArray(response)) {
      return statesListResponseSchema.parse(response);
    }
    if (response.items) {
      return statesListResponseSchema.parse(response.items);
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

import apiClient from '@/api/axiosClient';

export const exchangeRatesApi = {
  async getList(params) {
    const response = await apiClient.get('/admin/exchange-rates', { params });
    return Array.isArray(response?.data) ? response.data : [];
  },

  /** Upserts the rate for the day: loading the same day + source again corrects it. */
  async setDaily({ rate, source, effective_date, from_currency = 'USD', to_currency = 'VES' }) {
    const response = await apiClient.put('/admin/exchange-rates/daily', {
      rate,
      source,
      effective_date,
      from_currency,
      to_currency,
    });
    return response?.data;
  },
};

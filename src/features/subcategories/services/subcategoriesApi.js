import apiClient from '@/api/axiosClient';
import { subcategoriesListResponseSchema } from '../schemas/subcategories.schema';

// Subcategories are never deleted (only deactivated), so there is no delete endpoint.
export const subcategoriesApi = {
  // GET /admin/subcategories?category_id=
  async getList(categoryId) {
    const response = await apiClient.get('/admin/subcategories', { params: { category_id: categoryId } });
    return subcategoriesListResponseSchema.parse(Array.isArray(response?.data) ? response.data : []);
  },

  // POST /admin/subcategories
  async create(data) {
    return apiClient.post('/admin/subcategories', data);
  },

  // PATCH /admin/subcategories/:id  (only name_es, name_en, sort_order)
  async update(id, data) {
    return apiClient.patch(`/admin/subcategories/${id}`, data);
  },

  // PATCH /admin/subcategories/:id/status
  async updateStatus(id, { is_active }) {
    return apiClient.patch(`/admin/subcategories/${id}/status`, { is_active });
  },
};

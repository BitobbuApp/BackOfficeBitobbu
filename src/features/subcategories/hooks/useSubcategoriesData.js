import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subcategoriesApi } from '../services/subcategoriesApi';
import { useLookupsList } from '@/features/lookups/hooks/useLookupsData';
import { LOOKUP_TABLES_BY_KEY } from '@/features/lookups/lookupsTableRegistry';

const SUBCATEGORIES_KEY = ['subcategories'];

/** Parent categories (from the categories lookup table). */
export function useCategoriesOptions() {
  return useLookupsList(LOOKUP_TABLES_BY_KEY.categories);
}

export function useSubcategoriesList(categoryId) {
  return useQuery({
    queryKey: [...SUBCATEGORIES_KEY, 'list', categoryId],
    queryFn: () => subcategoriesApi.getList(categoryId),
    enabled: !!categoryId,
  });
}

export function useCreateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => subcategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORIES_KEY });
      toast.success('Subcategoría creada correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al crear la subcategoría');
    },
  });
}

export function useUpdateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => subcategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORIES_KEY });
      toast.success('Subcategoría actualizada correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar la subcategoría');
    },
  });
}

export function useUpdateSubcategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }) => subcategoriesApi.updateStatus(id, { is_active }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBCATEGORIES_KEY });
      toast.success(variables.is_active ? 'Subcategoría activada' : 'Subcategoría desactivada');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el estado de la subcategoría');
    },
  });
}

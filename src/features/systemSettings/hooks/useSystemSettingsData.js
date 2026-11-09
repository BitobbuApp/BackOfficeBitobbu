import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { systemSettingsApi } from '../services/systemSettingsApi';

const QUERY_KEY = ['system-settings'];

export function useSystemSettings(enabled = true) {
  return useQuery({ queryKey: QUERY_KEY, queryFn: systemSettingsApi.getList, enabled });
}

export function useUpdateSystemSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) => systemSettingsApi.updateMany(values),
    onSuccess: (list) => {
      queryClient.setQueryData(QUERY_KEY, list);
      toast.success('Configuracion guardada');
    },
    onError: (error) => {
      // Validation errors list every invalid field: show them all.
      const details = error?.response?.data?.error?.details;
      const message = Array.isArray(details) && details.length
        ? details.join(' · ')
        : error?.response?.data?.message || 'Error al guardar la configuracion';
      toast.error(message);
    },
  });
}

export function useTestSystemSettings() {
  return useMutation({
    mutationFn: ({ group, payload }) => systemSettingsApi.test(group, payload),
    onSuccess: (res) => toast.success(res?.message || 'Prueba exitosa'),
    onError: (error) => {
      toast.error(error?.response?.data?.error?.message || error?.response?.data?.message || 'La prueba fallo');
    },
  });
}

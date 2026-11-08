import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { systemSettingsApi } from '../services/systemSettingsApi';

const QUERY_KEY = ['system-settings'];

export function useSystemSettings(enabled = true) {
  return useQuery({ queryKey: QUERY_KEY, queryFn: systemSettingsApi.getList, enabled });
}

export function useUpdateSystemSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }) => systemSettingsApi.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Configuracion actualizada');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar la configuracion');
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

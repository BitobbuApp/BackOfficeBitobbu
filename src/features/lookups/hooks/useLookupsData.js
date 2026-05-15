import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lookupsApi } from '../services/lookupsApi';
import { toast } from 'sonner';

export function useLookupsList(tableConfig) {
  return useQuery({
    queryKey: ['lookups', tableConfig?.key, tableConfig?.endpoint],
    queryFn: () => lookupsApi.getList(tableConfig),
    enabled: !!tableConfig?.endpoint,
  });
}

export function useCreateLookup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableConfig, data }) => lookupsApi.create(tableConfig, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lookups', variables.tableConfig.key] });
      toast.success('Registro creado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al crear registro');
    },
  });
}

export function useUpdateLookup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableConfig, id, data }) => lookupsApi.update(tableConfig, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lookups', variables.tableConfig.key] });
      toast.success('Registro actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar registro');
    },
  });
}

export function useUpdateLookupStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableConfig, id, data }) => lookupsApi.updateStatus(tableConfig, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lookups', variables.tableConfig.key] });
      toast.success('Estado del registro actualizado');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el estado del registro');
    },
  });
}

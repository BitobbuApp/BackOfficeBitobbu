import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lookupsApi } from '../services/lookupsApi';
import { toast } from 'sonner';

export function useLookupsList(tableKey) {
  return useQuery({
    queryKey: ['lookups', tableKey],
    queryFn: () => lookupsApi.getList(tableKey),
    enabled: !!tableKey,
  });
}

export function useCreateLookup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableKey, data }) => lookupsApi.create(tableKey, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lookups', variables.tableKey] });
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
    mutationFn: ({ tableKey, id, data }) => lookupsApi.update(tableKey, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lookups', variables.tableKey] });
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
    mutationFn: ({ tableKey, id, data }) => lookupsApi.updateStatus(tableKey, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lookups', variables.tableKey] });
      toast.success('Estado del registro actualizado');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el estado del registro');
    },
  });
}

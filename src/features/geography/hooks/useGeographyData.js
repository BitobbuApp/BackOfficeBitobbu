import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { geographyApi } from '../services/geographyApi';
import { toast } from 'sonner';

export function useCountriesList() {
  return useQuery({
    queryKey: ['geography', 'countries'],
    queryFn: () => geographyApi.getCountries(),
  });
}

export function useCreateCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => geographyApi.createCountry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geography', 'countries'] });
      toast.success('País creado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al crear país');
    },
  });
}

export function useUpdateCountry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => geographyApi.updateCountry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geography', 'countries'] });
      toast.success('País actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar país');
    },
  });
}

export function useUpdateCountryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => geographyApi.updateCountryStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geography', 'countries'] });
      toast.success('Estado del país actualizado');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar estado del país');
    },
  });
}

export function useStatesList(countryCode) {
  return useQuery({
    queryKey: ['geography', 'states', countryCode],
    queryFn: () => geographyApi.getStates(countryCode),
    enabled: !!countryCode,
  });
}

export function useCreateState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => geographyApi.createState(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geography', 'states'] });
      toast.success('Estado/Provincia creado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al crear estado');
    },
  });
}

export function useUpdateState() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => geographyApi.updateState(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geography', 'states'] });
      toast.success('Estado/Provincia actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar estado');
    },
  });
}

export function useUpdateStateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => geographyApi.updateStateStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geography', 'states'] });
      toast.success('Estado de la provincia actualizado');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar el estado de la provincia');
    },
  });
}

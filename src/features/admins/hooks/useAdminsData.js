import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminsApi } from '../services/adminsApi';
import { toast } from 'sonner';

export const useAdminsList = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: () => adminsApi.getList(),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Administrador creado correctamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear administrador');
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => adminsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Administrador actualizado correctamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al actualizar administrador');
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Administrador eliminado correctamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar administrador');
    },
  });
};

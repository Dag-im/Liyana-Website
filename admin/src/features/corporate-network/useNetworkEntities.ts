import {
  networkEntitiesApi,
  type GetNetworkEntitiesParams,
} from '@/api/network-entities.api';
import { networkMetaApi } from '@/api/network-meta.api';
import { showErrorToast } from '@/lib/error-utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useNetworkEntities(params: GetNetworkEntitiesParams) {
  return useQuery({
    queryKey: ['network-entities', params],
    queryFn: () => networkEntitiesApi.getNetworkEntities(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useNetworkTree() {
  return useQuery({
    queryKey: ['network-entities', 'tree'],
    queryFn: () => networkEntitiesApi.getNetworkTree(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useNetworkEntity(id: string) {
  return useQuery({
    queryKey: ['network-entities', id],
    queryFn: () => networkEntitiesApi.getNetworkEntity(id),
    enabled: Boolean(id),
  });
}

export function useNetworkMeta() {
  return useQuery({
    queryKey: ['network-meta'],
    queryFn: () => networkMetaApi.getNetworkMeta(),
  });
}

export function useCreateNetworkEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => networkEntitiesApi.createNetworkEntity(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-entities'] });
      queryClient.invalidateQueries({ queryKey: ['network-meta'] });
      toast.success('Entity created');
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to create entity'),
  });
}

export function useUpdateNetworkEntity(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => networkEntitiesApi.updateNetworkEntity(id, dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['network-entities', id] }),
        queryClient.invalidateQueries({
          queryKey: ['network-entities', 'tree'],
          refetchType: 'all',
        }),
        queryClient.invalidateQueries({
          queryKey: ['network-entities'],
          refetchType: 'all',
        }),
        queryClient.invalidateQueries({ queryKey: ['network-meta'] }),
      ]);
      toast.success('Entity updated');
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to update entity'),
  });
}

export function useMoveNetworkEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { parentId: string | null } }) =>
      networkEntitiesApi.moveNetworkEntity(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-entities'] });
      queryClient.invalidateQueries({ queryKey: ['network-meta'] });
      toast.success('Entity moved');
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to move entity'),
  });
}

export function useDeleteNetworkEntity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => networkEntitiesApi.deleteNetworkEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-entities'] });
      queryClient.invalidateQueries({ queryKey: ['network-meta'] });
      toast.success('Entity and all descendants deleted');
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to delete entity'),
  });
}

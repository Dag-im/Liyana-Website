import { networkRelationsApi } from '@/api/network-relations.api';
import { showErrorToast } from '@/lib/error-utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useNetworkRelations() {
  return useQuery({
    queryKey: ['network-relations'],
    queryFn: () => networkRelationsApi.getNetworkRelations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateNetworkRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: {
      name: string;
      label: string;
      description?: string;
      sortOrder?: number;
    }) => networkRelationsApi.createNetworkRelation(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-relations'] });
      toast.success('Relation type created');
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to create relation type'),
  });
}

export function useUpdateNetworkRelation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => networkRelationsApi.updateNetworkRelation(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-relations'] });
      toast.success('Relation type updated');
    },
    onError: (error: unknown) => showErrorToast(error, 'Failed to update relation type'),
  });
}

export function useDeleteNetworkRelation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => networkRelationsApi.deleteNetworkRelation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-relations'] });
      toast.success('Relation type deleted');
    },
    onError: (error: any) => {
      if (error.status === 409) {
        toast.error('Cannot delete: entities are assigned to this relation type');
      } else {
        showErrorToast(error, 'Failed to delete relation type');
      }
    },
  });
}

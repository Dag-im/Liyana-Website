import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createUser,
  deactivateUser,
  getUsers,
  updateUser,
  type CreateUserDto,
  type UpdateUserDto,
} from '@/api/users.api'

export function useMyTeam(params?: { page?: number; perPage?: number; search?: string }) {
  return useQuery({
    queryKey: ['my-team', params],
    queryFn: () =>
      getUsers({
        page: params?.page,
        perPage: params?.perPage,
        search: params?.search,
        role: 'CUSTOMER_SERVICE',
      }),
  })
}

export function useCreateCSUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateUserDto) => createUser(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateCSUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      updateUser(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeactivateCSUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-team'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

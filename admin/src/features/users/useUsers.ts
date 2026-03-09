import { useMutation, useQuery } from '@tanstack/react-query'

import {
  changePassword,
  createUser,
  deactivateUser,
  getUser,
  getUsers,
  type CreateUserDto,
  type GetUsersParams,
  type UpdateUserDto,
  updateUser,
} from '@/api/users.api'

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (dto: CreateUserDto) => createUser(dto),
  })
}

export function useUpdateUser(id: string) {
  return useMutation({
    mutationFn: (dto: UpdateUserDto) => updateUser(id, dto),
  })
}

export function useChangePassword(id: string) {
  return useMutation({
    mutationFn: (dto: { newPassword: string }) => changePassword(id, dto),
  })
}

export function useDeactivateUser() {
  return useMutation({
    mutationFn: (id: string) => deactivateUser(id),
  })
}

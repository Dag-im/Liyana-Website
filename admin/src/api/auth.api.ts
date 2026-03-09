import { apiRequest } from '@/lib/api-client'
import type { User } from '@/types/user.types'

export function login(email: string, password: string): Promise<User> {
  return apiRequest<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logout(): Promise<void> {
  await apiRequest<{ message: string }>('/auth/logout', {
    method: 'POST',
  })
}

export function me(): Promise<User> {
  return apiRequest<User>('/auth/me')
}

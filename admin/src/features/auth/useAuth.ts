import { useQuery } from '@tanstack/react-query'

import { me } from '@/api/auth.api'

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: me,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

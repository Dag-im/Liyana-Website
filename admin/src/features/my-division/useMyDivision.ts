import { useAuth } from '@/features/auth/useAuth'
import {
  useDivision,
  useUpdateDivision,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from '@/features/divisions/useDivisions'

export function useMyDivision() {
  const { data: user } = useAuth()
  const divisionId = user?.divisionId ?? ''
  return useDivision(divisionId)
}

export function useUpdateMyDivision() {
  const { data: user } = useAuth()
  const divisionId = user?.divisionId ?? ''
  return useUpdateDivision(divisionId)
}

export { useCreateDoctor, useDeleteDoctor, useUpdateDoctor }

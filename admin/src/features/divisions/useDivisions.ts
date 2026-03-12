import { divisionsApi, type GetDivisionsParams } from '@/api/divisions.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Doctor } from '@/types/services.types'

export function useDivisions(params: GetDivisionsParams) {
  return useQuery({
    queryKey: ['divisions', params],
    queryFn: () => divisionsApi.getDivisions(params),
  })
}

export function useDivision(id: string) {
  return useQuery({
    queryKey: ['divisions', id],
    queryFn: () => divisionsApi.getDivision(id),
    enabled: Boolean(id),
  })
}

export function useDivisionDoctors(id: string) {
  return useQuery({
    queryKey: ['divisions', id, 'doctors'],
    queryFn: () => divisionsApi.getDivisionDoctors(id),
    enabled: Boolean(id),
  })
}

export function useCreateDivision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: any) => divisionsApi.createDivision(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
    },
  })
}

export function useUpdateDivision(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: any) => divisionsApi.updateDivision(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions', id] })
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
    },
  })
}

export function useDeleteDivision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => divisionsApi.deleteDivision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
    },
  })
}

export function useCreateDoctor(divisionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: Omit<Doctor, 'id' | 'divisionId'>) => divisionsApi.createDoctor(divisionId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions', divisionId] })
      queryClient.invalidateQueries({ queryKey: ['divisions', divisionId, 'doctors'] })
    },
  })
}

export function useUpdateDoctor(divisionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<Omit<Doctor, 'id' | 'divisionId'>> }) => divisionsApi.updateDoctor(divisionId, id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions', divisionId] })
      queryClient.invalidateQueries({ queryKey: ['divisions', divisionId, 'doctors'] })
    },
  })
}

export function useDeleteDoctor(divisionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => divisionsApi.deleteDoctor(divisionId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions', divisionId] })
      queryClient.invalidateQueries({ queryKey: ['divisions', divisionId, 'doctors'] })
    },
  })
}

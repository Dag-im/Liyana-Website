import { bookingsApi, type GetBookingsParams } from '@/api/bookings.api'
import type { BookingStatus } from '@/types/booking.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useBookings(params: GetBookingsParams) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingsApi.getBookings(params),
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.getBooking(id),
    enabled: Boolean(id),
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: BookingStatus; notes?: string }) =>
      bookingsApi.updateBookingStatus(id, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

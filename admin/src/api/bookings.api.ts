import { apiRequest } from '@/lib/api-client'
import type { Booking, BookingStatus } from '@/types/booking.types'
import type { PaginatedResponse } from '@/types/user.types'

export type GetBookingsParams = {
  page?: number
  perPage?: number
  status?: BookingStatus
  selectionType?: string
  divisionId?: string
  startDate?: string
  endDate?: string
}

export const bookingsApi = {
  getBookings: (params: GetBookingsParams) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value.toString())
    })
    const query = searchParams.toString()
    return apiRequest<PaginatedResponse<Booking>>(`/bookings${query ? `?${query}` : ''}`)
  },

  getBooking: (id: string) =>
    apiRequest<Booking>(`/bookings/${id}`),

  updateBookingStatus: (id: string, dto: { status: BookingStatus; notes?: string }) =>
    apiRequest<Booking>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    }),
}

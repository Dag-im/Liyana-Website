import { apiRequest } from '@/lib/api-client';
import type { Booking, CreateBookingDto } from '@/types/booking.types';

export async function createBooking(dto: CreateBookingDto): Promise<Booking> {
  return apiRequest<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

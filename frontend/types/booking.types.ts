export type SelectionType = 'general' | 'service' | 'doctor';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type CreateBookingDto = {
  divisionId: string;
  selectionType: SelectionType;
  selectionId?: string;
  selectionLabel: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
};

export type Booking = {
  id: string;
  divisionId: string;
  divisionName: string;
  selectionType: SelectionType;
  selectionId: string | null;
  selectionLabel: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

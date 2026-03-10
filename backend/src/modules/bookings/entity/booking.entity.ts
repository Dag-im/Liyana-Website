import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SelectionType {
  GENERAL = 'general',
  SERVICE = 'service',
  DOCTOR = 'doctor',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  divisionId: string;

  @Column({ type: 'varchar' })
  divisionName: string;

  @Column({ type: 'enum', enum: SelectionType })
  selectionType: SelectionType;

  @Column({ type: 'varchar', nullable: true, default: null })
  selectionId: string | null;

  @Column({ type: 'varchar' })
  selectionLabel: string;

  @Column({ type: 'varchar' })
  patientName: string;

  @Column({ type: 'varchar' })
  patientPhone: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  patientEmail: string | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

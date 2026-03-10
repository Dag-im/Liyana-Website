import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Division } from './division.entity';

@Entity('division_contacts')
export class DivisionContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  googleMap: string;

  @OneToOne(() => Division, (division) => division.contact, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'divisionId' })
  division: Division;

  @Column({ unique: true })
  divisionId: string;
}

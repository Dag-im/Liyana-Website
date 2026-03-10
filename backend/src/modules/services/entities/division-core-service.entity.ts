import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Division } from './division.entity';

@Entity('division_core_services')
export class DivisionCoreService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Division, (division) => division.coreServices, {
    onDelete: 'CASCADE',
  })
  division: Division;

  @Column()
  divisionId: string;
}

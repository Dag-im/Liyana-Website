import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Division } from './division.entity';

@Entity('division_stats')
export class DivisionStat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column()
  value: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Division, (division) => division.stats, {
    onDelete: 'CASCADE',
  })
  division: Division;

  @Column()
  divisionId: string;
}

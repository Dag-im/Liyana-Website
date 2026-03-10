import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Division } from './division.entity';

@Entity('division_images')
export class DivisionImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Division, (division) => division.images, {
    onDelete: 'CASCADE',
  })
  division: Division;

  @Column()
  divisionId: string;
}

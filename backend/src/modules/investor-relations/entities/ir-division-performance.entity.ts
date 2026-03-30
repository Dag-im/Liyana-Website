import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ir_division_performance')
export class IrDivisionPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  divisionName: string;

  @Column({ type: 'varchar', nullable: true })
  divisionId: string | null;

  @Column({ type: 'varchar' })
  revenuePercent: string;

  @Column({ type: 'varchar' })
  growthPercent: string;

  @Column({ type: 'varchar' })
  tag: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

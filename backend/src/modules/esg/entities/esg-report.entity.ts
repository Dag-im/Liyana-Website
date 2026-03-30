import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EsgReportType {
  ANNUAL = 'annual',
  ESG = 'esg',
  SUSTAINABILITY = 'sustainability',
  OTHER = 'other',
}

@Entity('esg_reports')
export class EsgReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  year: string;

  @Column({ type: 'enum', enum: EsgReportType })
  type: EsgReportType;

  @Column({ type: 'varchar' })
  filePath: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EsgGovernanceItemType {
  POLICY = 'policy',
  CERTIFICATION = 'certification',
  RISK = 'risk',
}

@Entity('esg_governance_items')
export class EsgGovernanceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EsgGovernanceItemType })
  type: EsgGovernanceItemType;

  @Column({ type: 'varchar', nullable: true })
  document: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

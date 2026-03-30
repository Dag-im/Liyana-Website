import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EsgPillarInitiative } from './esg-pillar-initiative.entity';

@Entity('esg_pillars')
export class EsgPillar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  icon: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @Column({ type: 'varchar', nullable: true })
  document: string | null;

  @OneToMany(() => EsgPillarInitiative, (initiative) => initiative.pillar, {
    cascade: true,
  })
  initiatives: EsgPillarInitiative[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

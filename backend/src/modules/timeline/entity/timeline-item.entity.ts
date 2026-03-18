import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TimelineCategory {
  MILESTONE = 'milestone',
  ACHIEVEMENT = 'achievement',
  EXPANSION = 'expansion',
  INNOVATION = 'innovation',
}

@Entity('timeline_items')
export class TimelineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  achievement?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({
    type: 'enum',
    enum: TimelineCategory,
    nullable: true,
  })
  category?: TimelineCategory;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

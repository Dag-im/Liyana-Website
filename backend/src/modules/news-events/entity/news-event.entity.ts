import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NewsEventType {
  NEWS = 'news',
  EVENT = 'event',
}

export enum NewsEventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

@Entity()
export class NewsEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: NewsEventType })
  type!: NewsEventType;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'varchar', nullable: true })
  location!: string | null;

  @Column({ type: 'varchar' })
  summary!: string;

  @Column({ type: 'simple-array' })
  content!: string[];

  @Column({ type: 'simple-array', nullable: true })
  keyHighlights!: string[] | null;

  @Column({ type: 'varchar' })
  mainImage!: string;

  @Column({ type: 'varchar' })
  image1!: string;

  @Column({ type: 'varchar' })
  image2!: string;

  @Column({
    type: 'enum',
    enum: NewsEventStatus,
    default: NewsEventStatus.DRAFT,
  })
  status!: NewsEventStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt!: Date | null;

  @Column({ type: 'varchar' })
  createdById!: string;

  @Column({ type: 'varchar' })
  createdByName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogCategory } from './blog-category.entity';

export enum BlogStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
}

@Entity('blog_posts')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'varchar' })
  excerpt!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'varchar' })
  image!: string;

  @Column({ type: 'varchar' })
  readTime!: string;

  @Column({ type: 'boolean', default: false })
  featured!: boolean;

  @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
  status!: BlogStatus;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt!: Date | null;

  @Column({ type: 'varchar' })
  authorId!: string;

  @Column({ type: 'varchar' })
  authorName!: string;

  @Column({ type: 'varchar' })
  authorRole!: string;

  @Column({ type: 'varchar' })
  categoryId!: string;

  @ManyToOne(() => BlogCategory, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category!: BlogCategory;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}

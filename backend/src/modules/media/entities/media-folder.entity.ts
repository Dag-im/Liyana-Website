import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MediaItem } from './media-item.entity';
import { MediaTag } from './media-tag.entity';

@Entity({ name: 'media_folders' })
export class MediaFolder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  coverImage: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column()
  tagId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => MediaTag, (tag) => tag.folders, { eager: true })
  @JoinColumn({ name: 'tagId' })
  tag: MediaTag;

  @OneToMany(() => MediaItem, (item) => item.folder)
  items: MediaItem[];

  // Computed fields (not stored in DB)
  mediaCount?: number;
  lastUpdated?: Date;
}

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
import { MediaFolder } from './media-folder.entity';

export enum MediaItemType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity({ name: 'media_items' })
export class MediaItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: MediaItemType })
  type: MediaItemType;

  @Column()
  url: string;

  @Column({ type: 'text', nullable: true })
  thumbnail: string | null;

  @Column({ default: 0 })
  sortOrder: number;

  @Column()
  folderId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => MediaFolder, (folder) => folder.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folderId' })
  folder: MediaFolder;
}

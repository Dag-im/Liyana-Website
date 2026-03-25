import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UploadAssetStatus {
  TEMP = 'TEMP',
  ATTACHED = 'ATTACHED',
  DELETED = 'DELETED',
}

@Entity('upload_assets')
@Index('IDX_UPLOAD_ASSETS_OWNER_STATUS', ['ownerUserId', 'status'])
@Index('IDX_UPLOAD_ASSETS_STATUS_EXPIRES_AT', ['status', 'expiresAt'])
export class UploadAsset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  path!: string;

  @Column({
    type: 'enum',
    enum: UploadAssetStatus,
    default: UploadAssetStatus.TEMP,
  })
  status!: UploadAssetStatus;

  @Column({ type: 'varchar' })
  ownerUserId!: string;

  @Column({ type: 'varchar', nullable: true })
  attachedEntityType!: string | null;

  @Column({ type: 'varchar', nullable: true })
  attachedEntityId!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}

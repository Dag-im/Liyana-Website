import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { NotificationUrgency } from '../../../common/types/notification-urgency.enum';
import { UserRole } from '../../../common/types/user-role.enum';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'enum',
    enum: NotificationUrgency,
    default: NotificationUrgency.LOW,
  })
  urgency!: NotificationUrgency;

  @Index('IDX_NOTIFICATIONS_TARGET_USER')
  @Column({ type: 'varchar', nullable: true })
  targetUserId!: string | null;

  @Column({ type: 'enum', enum: UserRole })
  targetRole!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  relatedEntityType!: string | null;

  @Column({ type: 'varchar', nullable: true })
  relatedEntityId!: string | null;

  @Column({ type: 'varchar' })
  createdBy!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;
}

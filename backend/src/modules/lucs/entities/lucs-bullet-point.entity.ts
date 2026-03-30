import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LucsPillar } from './lucs-pillar.entity';

@Entity('lucs_bullet_points')
export class LucsBulletPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  point: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @ManyToOne(() => LucsPillar, (pillar) => pillar.bulletPoints, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pillarId' })
  pillar: LucsPillar;

  @Column({ type: 'varchar' })
  pillarId: string;
}

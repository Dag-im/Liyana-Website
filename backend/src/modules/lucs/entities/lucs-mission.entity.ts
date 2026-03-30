import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('lucs_mission')
export class LucsMission {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'varchar', default: 'Our Mission' })
  missionTitle: string;

  @Column({ type: 'text', default: '' })
  missionDescription: string;

  @Column({ type: 'varchar', default: 'Target' })
  missionIcon: string;

  @Column({ type: 'varchar', default: 'Our Vision' })
  visionTitle: string;

  @Column({ type: 'text', default: '' })
  visionDescription: string;

  @Column({ type: 'varchar', default: 'Eye' })
  visionIcon: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

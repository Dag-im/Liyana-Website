import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_mission_vision')
export class MissionVision {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'varchar', default: 'Our Mission' })
  missionTitle: string;

  @Column({ type: 'text' })
  missionDescription: string;

  @Column({ type: 'varchar', default: 'Target' })
  missionIcon: string;

  @Column({ type: 'varchar', default: 'Our Vision' })
  visionTitle: string;

  @Column({ type: 'text' })
  visionDescription: string;

  @Column({ type: 'varchar', default: 'Eye' })
  visionIcon: string;

  @UpdateDateColumn()
  updatedAt: Date;
}

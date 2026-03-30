import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EsgPillar } from './esg-pillar.entity';

@Entity('esg_pillar_initiatives')
export class EsgPillarInitiative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => EsgPillar, (pillar) => pillar.initiatives, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pillarId' })
  pillar: EsgPillar;

  @Column({ type: 'varchar' })
  pillarId: string;
}

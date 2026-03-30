import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('lucs_pillar_intro')
export class LucsPillarIntro {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'varchar', default: 'What We Do' })
  title: string;

  @Column({ type: 'varchar', default: '' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

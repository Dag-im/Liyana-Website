import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('lucs_hero')
export class LucsHero {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({
    type: 'varchar',
    default: 'Transforming Communities Through Healthcare',
  })
  tagline: string;

  @Column({ type: 'varchar', default: '' })
  subtitle: string;

  @Column({ type: 'varchar', nullable: true })
  backgroundImage: string | null;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

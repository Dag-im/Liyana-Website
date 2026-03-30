import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('esg_hero')
export class EsgHero {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({
    type: 'varchar',
    default: 'Building a Sustainable Future',
  })
  tagline: string;

  @Column({
    type: 'varchar',
    default:
      'Our commitment to Environmental, Social, and Governance excellence',
  })
  subtitle: string;

  @Column({ type: 'varchar', nullable: true })
  backgroundImage: string | null;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

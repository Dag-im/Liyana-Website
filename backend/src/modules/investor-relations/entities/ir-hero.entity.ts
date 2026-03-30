import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('ir_hero')
export class IrHero {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'varchar', default: 'Investing in the Future of Healthcare' })
  tagline: string;

  @Column({ type: 'varchar', default: '' })
  subtitle: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

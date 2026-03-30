import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export enum LucsCtaType {
  PHONE = 'phone',
  EMAIL = 'email',
  URL = 'url',
}

@Entity('lucs_cta')
export class LucsCta {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'varchar', default: 'Partner With Us' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: LucsCtaType, default: LucsCtaType.EMAIL })
  ctaType: LucsCtaType;

  @Column({ type: 'varchar', default: '' })
  ctaValue: string;

  @Column({ type: 'varchar', default: 'Get In Touch' })
  ctaLabel: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

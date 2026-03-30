import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('esg_lucs_bridge')
export class EsgLucsBridge {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'varchar', default: 'See Our Impact Through LUCS' })
  title: string;

  @Column({ type: 'varchar', default: '' })
  description: string;

  @Column({ type: 'varchar', default: 'Learn About LUCS' })
  buttonText: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

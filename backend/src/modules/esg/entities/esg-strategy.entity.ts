import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('esg_strategy')
export class EsgStrategy {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

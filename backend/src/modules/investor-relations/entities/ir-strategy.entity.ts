import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('ir_strategy')
export class IrStrategy {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

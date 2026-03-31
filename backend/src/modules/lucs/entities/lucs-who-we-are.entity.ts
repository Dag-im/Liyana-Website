import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('lucs_who_we_are')
export class LucsWhoWeAre {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

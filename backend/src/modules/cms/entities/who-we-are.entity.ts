import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_who_we_are')
export class WhoWeAre {
  @PrimaryColumn({ type: 'varchar', default: 'singleton' })
  id: string;

  @Column({ type: 'text' })
  content: string;

  @UpdateDateColumn()
  updatedAt: Date;
}

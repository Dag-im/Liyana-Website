import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NetworkRelation } from './network-relation.entity';

@Entity({ name: 'network_entities' })
export class NetworkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  summary: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  insight: string;

  @Column()
  icon: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', nullable: true })
  parentId: string | null;

  @Column({ type: 'varchar' })
  relationId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => NetworkEntity, (e) => e.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: NetworkEntity;

  @OneToMany(() => NetworkEntity, (e) => e.parent)
  children: NetworkEntity[];

  @ManyToOne(() => NetworkRelation, (r) => r.networkEntities, { eager: true })
  @JoinColumn({ name: 'relationId' })
  relation: NetworkRelation;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NetworkEntity } from './network-entity.entity';

@Entity({ name: 'network_relations' })
export class NetworkRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  label: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => NetworkEntity, (e) => e.relation)
  networkEntities: NetworkEntity[];
}

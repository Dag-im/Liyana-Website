import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Division } from './division.entity';

@Entity('service_categories')
export class ServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  tagline: string;

  @Column()
  heroImage: string;

  @Column('simple-array')
  attributes: string[];

  @Column({ default: 'Hospital' })
  icon: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Division, (division) => division.serviceCategory)
  divisions: Division[];
}

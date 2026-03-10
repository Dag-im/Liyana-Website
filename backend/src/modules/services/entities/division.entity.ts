import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DivisionCategory } from './division-category.entity';
import { DivisionContact } from './division-contact.entity';
import { DivisionCoreService } from './division-core-service.entity';
import { DivisionImage } from './division-image.entity';
import { DivisionStat } from './division-stat.entity';
import { Doctor } from './doctor.entity';
import { ServiceCategory } from './service-category.entity';

@Entity('divisions')
export class Division {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column({ nullable: true })
  location: string;

  @Column('text')
  overview: string;

  @Column({ nullable: true })
  logo: string;

  @Column('simple-array')
  description: string[];

  @Column({ nullable: true })
  groupPhoto: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => ServiceCategory, (sc) => sc.divisions)
  @JoinColumn({ name: 'serviceCategoryId' })
  serviceCategory: ServiceCategory;

  @Column()
  serviceCategoryId: string;

  @ManyToOne(() => DivisionCategory, (dc) => dc.divisions)
  @JoinColumn({ name: 'divisionCategoryId' })
  divisionCategory: DivisionCategory;

  @Column()
  divisionCategoryId: string;

  @OneToMany(() => DivisionImage, (image) => image.division, { cascade: true })
  images: DivisionImage[];

  @OneToMany(() => DivisionCoreService, (cs) => cs.division, { cascade: true })
  coreServices: DivisionCoreService[];

  @OneToMany(() => DivisionStat, (stat) => stat.division, { cascade: true })
  stats: DivisionStat[];

  @OneToMany(() => Doctor, (doctor) => doctor.division, { cascade: true })
  doctors: Doctor[];

  @OneToOne(() => DivisionContact, (contact) => contact.division, {
    cascade: true,
  })
  contact: DivisionContact;
}

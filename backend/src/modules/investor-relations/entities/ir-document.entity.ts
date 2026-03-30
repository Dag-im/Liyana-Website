import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IrDocumentCategory {
  REPORT = 'report',
  PRESENTATION = 'presentation',
  FILING = 'filing',
  OTHER = 'other',
}

@Entity('ir_documents')
export class IrDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  year: string;

  @Column({ type: 'enum', enum: IrDocumentCategory })
  category: IrDocumentCategory;

  @Column({ type: 'varchar' })
  filePath: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

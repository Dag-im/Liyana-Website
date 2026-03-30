import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IrFinancialCell } from './ir-financial-cell.entity';

export enum IrFinancialPeriodType {
  ANNUAL = 'annual',
  QUARTERLY = 'quarterly',
}

@Entity('ir_financial_rows')
export class IrFinancialRow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  period: string;

  @Column({ type: 'enum', enum: IrFinancialPeriodType })
  periodType: IrFinancialPeriodType;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @OneToMany(() => IrFinancialCell, (cell) => cell.row, { cascade: true })
  cells: IrFinancialCell[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

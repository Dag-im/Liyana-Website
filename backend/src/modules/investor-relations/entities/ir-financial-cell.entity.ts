import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IrFinancialColumn } from './ir-financial-column.entity';
import { IrFinancialRow } from './ir-financial-row.entity';

@Entity('ir_financial_cells')
export class IrFinancialCell {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  value: string;

  @ManyToOne(() => IrFinancialRow, (row) => row.cells, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rowId' })
  row: IrFinancialRow;

  @Column({ type: 'varchar' })
  rowId: string;

  @ManyToOne(() => IrFinancialColumn, { eager: true })
  @JoinColumn({ name: 'columnId' })
  column: IrFinancialColumn;

  @Column({ type: 'varchar' })
  columnId: string;
}

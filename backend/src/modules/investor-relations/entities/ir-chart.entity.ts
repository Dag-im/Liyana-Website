import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IrChartDataPoint } from './ir-chart-data-point.entity';

export enum IrChartType {
  LINE = 'line',
  PIE = 'pie',
  BAR = 'bar',
}

@Entity('ir_charts')
export class IrChart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: IrChartType })
  type: IrChartType;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @OneToMany(() => IrChartDataPoint, (dataPoint) => dataPoint.chart, {
    cascade: true,
  })
  dataPoints: IrChartDataPoint[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

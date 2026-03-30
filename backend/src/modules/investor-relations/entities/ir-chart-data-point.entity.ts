import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IrChart } from './ir-chart.entity';

@Entity('ir_chart_data_points')
export class IrChartDataPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  label: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: string;

  @Column({ type: 'varchar', nullable: true })
  color: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => IrChart, (chart) => chart.dataPoints, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chartId' })
  chart: IrChart;

  @Column({ type: 'varchar' })
  chartId: string;
}

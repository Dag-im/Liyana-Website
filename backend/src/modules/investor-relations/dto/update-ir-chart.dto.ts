import { PartialType } from '@nestjs/swagger';
import { CreateIrChartDto } from './create-ir-chart.dto';

export class UpdateIrChartDto extends PartialType(CreateIrChartDto) {}

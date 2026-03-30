import { PartialType } from '@nestjs/swagger';
import { CreateEsgMetricDto } from './create-esg-metric.dto';

export class UpdateEsgMetricDto extends PartialType(CreateEsgMetricDto) {}

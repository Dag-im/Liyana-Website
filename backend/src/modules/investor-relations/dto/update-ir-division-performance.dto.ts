import { PartialType } from '@nestjs/swagger';
import { CreateIrDivisionPerformanceDto } from './create-ir-division-performance.dto';

export class UpdateIrDivisionPerformanceDto extends PartialType(
  CreateIrDivisionPerformanceDto,
) {}

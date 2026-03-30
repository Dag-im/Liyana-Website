import { PartialType } from '@nestjs/swagger';
import { CreateIrKpiDto } from './create-ir-kpi.dto';

export class UpdateIrKpiDto extends PartialType(CreateIrKpiDto) {}

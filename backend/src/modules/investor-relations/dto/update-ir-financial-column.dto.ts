import { PartialType } from '@nestjs/swagger';
import { CreateIrFinancialColumnDto } from './create-ir-financial-column.dto';

export class UpdateIrFinancialColumnDto extends PartialType(
  CreateIrFinancialColumnDto,
) {}

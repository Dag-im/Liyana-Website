import { PartialType } from '@nestjs/swagger';
import { CreateIrFinancialRowDto } from './create-ir-financial-row.dto';

export class UpdateIrFinancialRowDto extends PartialType(CreateIrFinancialRowDto) {}

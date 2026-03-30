import { PartialType } from '@nestjs/swagger';
import { CreateEsgReportDto } from './create-esg-report.dto';

export class UpdateEsgReportDto extends PartialType(CreateEsgReportDto) {}
